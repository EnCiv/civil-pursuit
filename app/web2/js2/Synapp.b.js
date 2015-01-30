(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/francois/Dev/syn/app/web2/js2/Creator.js":[function(require,module,exports){
! function () {

  'use strict';

  var Form      =   require('./Form');
  var Nav       =   require('./Nav');
  var Item      =   require('./Item');
  var Upload    =   require('./Upload');
  var YouTube   =   require('./YouTube');

  function Creator (panel) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    if ( panel.constructor.name !== 'Panel' ) {
      throw new Error('Creator: Panel must be a Panel object');
    }

    this.panel = panel;

    this.template = $('#' + this.panel.getId()).find('.creator:first');
  }

  Creator.prototype.find = function (name) {
    switch ( name ) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'form':
        return this.template.find('form');

      case 'dropbox':
        return this.template.find('.drop-box');

      case 'subject':
        return this.template.find('[name="subject"]');

      case 'description':
        return this.template.find('[name="description"]');

      case 'item media':
        return this.template.find('.item-media');

      case 'reference':
        return this.template.find('.reference');

      case 'reference board':
        return this.template.find('.reference-board');
    }
  };

  Creator.prototype.render = function (cb) {
    if ( ! this.template.length ) {
      return cb(new Error('Creator not found in panel ' + this.panel.getId()));  
    }

    var creator = this;

    creator.template.data('creator', this);

    Upload(creator.find('dropbox'));

    creator.template.find('textarea').autogrow();

    creator.find('reference').on('change', function () {

      var creator     =   $(this).closest('.creator').data('creator');

      var board       =   creator.find('reference board');
      var reference   =   $(this);

      board.removeClass('hide').text('Looking up');

      app.socket.emit('get url title', $(this).val(),
        function (error, ref) {
          if ( ref.title ) {
            
            board.text(ref.title);
            reference.data('title', ref.title);

            var yt = YouTube(ref.url);

            if ( yt ) {
              creator.find('dropbox').hide();

              creator.find('item media')
                .empty()
                .append(yt);
            }
          }
          else {
            board.text('Looking up')
              .addClass('hide');
          }
        });
    });

    var form = new Form(creator.template);
    
    form.send(function () {
      Nav.hide(creator.template, app.domain.intercept(function () {

        var new_item = creator.toItem();

        new_item.user = synapp.user;

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', app.domain.intercept());

        app.socket.once('created item', function (item) {

          if ( new_item.upload ) {
            item.upload = new_item.upload;
          }

          if ( new_item.youtube ) {
            item.youtube = new_item.youtube;
          }

          var item  = new Item(item);

          var items = creator.panel.find('items');

          item.get(app.domain.intercept(function () {
            items.prepend(item.template);
            item.render(app.domain.intercept(function () {
              item.find('toggle promote').click();
            }));
          }));
        });

      }));
    });

    cb();
  };

  Creator.prototype.toItem = function () {
    var item = {
      type:         this.panel.type,
      subject:      this.find('subject').val(),
      description:  this.find('description').val()
    };

    if ( this.find('item media').find('img').length ) {

      if ( this.find('item media').find('.youtube-preview').length ) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      else {
        item.upload = this.find('item media').find('img').attr('src');
      }
    }
 
    return item;
  };

  module.exports = Creator;

} ();

},{"./Form":"/home/francois/Dev/syn/app/web2/js2/Form.js","./Item":"/home/francois/Dev/syn/app/web2/js2/Item.js","./Nav":"/home/francois/Dev/syn/app/web2/js2/Nav.js","./Upload":"/home/francois/Dev/syn/app/web2/js2/Upload.js","./YouTube":"/home/francois/Dev/syn/app/web2/js2/YouTube.js"}],"/home/francois/Dev/syn/app/web2/js2/Details.js":[function(require,module,exports){
! function () {

  'use strict';

  function Details(item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || item.constructor.name !== 'Item' ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('details');

      if ( ! self.template.length ) {
        throw new Error('Template not found');
      }
    });
  }

  Details.prototype.find = function (name) {
    switch ( name ) {
      case 'promoted bar':
        return this.template.find('.progress-bar');

      case 'feedback list':
        return this.template.find('.feedback-list');

      case 'votes':
        return this.template.find('.details-votes');
    }
  };

  Details.prototype.render = function (cb) {
    var self = this;

    var item = self.item.item;

    self.find('promoted bar')
      .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
      .text(Math.floor(item.promotions * 100 / item.views) + '%');

    if ( ! self.details ) {
      app.socket.emit('get item details', self.item.item._id);

      app.socket.once('got item details', function (details) {
        self.details = details;

        console.log('details', details)

        // Feedback

        details.feedbacks.forEach(function (feedback) {
          var tpl = $('<div class="pretext feedback"></div>');
          tpl.text(feedback.feedback);
          self.find('feedback list')
            .append(tpl)
            .append('<hr/>');

        });

        // Votes

        details.criterias.forEach(function (criteria, i) {
          self.find('votes').eq(i).find('h4').text(criteria.name);

          self.votes(criteria, self.find('votes').eq(i).find('svg'));
        });

      });
    }
  };

  Details.prototype.votes = function (criteria, svg) {
    var self = this;

    setTimeout(function () {

      var vote = self.details.votes[criteria._id];

      svg.attr('id', 'chart-' + self.details.item._id + '-' + criteria._id);

      var data = [];

      // If no votes, show nothing

      if ( ! vote ) {
        vote = {
          values: {
            '-1': 0,
            '0': 0,
            '1': 0
          },
          total: 0
        }
      }

      for ( var number in vote.values ) {
        data.push({
          label: 'number',
          value: vote.values[number] * 100 / vote.total
        });
      }

      var columns = ['votes'];

      data.forEach(function (d) {
        columns.push(d.value);
      });

      var chart = c3.generate({
        bindto: '#' + svg.attr('id'),

        data: {
          x: 'x',
          columns: [['x', -1, 0, 1], columns],
          type: 'bar'
        },

        grid: {
          x: {
            lines: 3
          }
        },
        
        axis: {
          x: {},
          
          y: {
            max: 90,

            show: false,

            tick: {
              count: 5,

              format: function (y) {
                return y;
              }
            }
          }
        },

        size: {
          height: 80
        },

        bar: {
          width: $(window).width() / 5
        }
      });
      }, 250);
  };

  module.exports = Details;

} ();

},{}],"/home/francois/Dev/syn/app/web2/js2/Form.js":[function(require,module,exports){
! function () {

  'use strict';

  function Form (form) {

    var self = this;

    this.form = form;

    this.form.on('submit', function () {
      self.submit();

      return false;
    });
  }

  Form.prototype.submit = function () {
    var self = this;

    var errors = [];

    self.form.find('[required]').each(function () {
      var val = $(this).val();

      if ( ! val ) {

        if ( ! errors.length ) {
          $(this)
            .addClass('error')
            .focus()
            .popover('show');
        }

        errors.push({ required: $(this).attr('name') });
      }

      else {
        $(this)
          .removeClass('error')
          .popover('hide');
      }
    });

    if ( ! errors.length ) {
      this.ok();
    }

    return false;
  };

  Form.prototype.send = function (fn) {
    this.ok = fn;
  };

  module.exports = Form;

} ();

},{}],"/home/francois/Dev/syn/app/web2/js2/Item.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav         =   require('./Nav');
  var Promote     =   require('./Promote');
  var Details     =   require('./Details');
  var YouTube     =   require('./YouTube');

  function Item (item) {

    if ( typeof app === 'undefined' || app.constructor.name !== 'Synapp' ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( typeof item !== 'object' ) {
        throw new Error('Item must be an object');
      }

      self.item = item;
    });
  }

  Item.prototype.get = function (cb) {
    var item = this;

    $.ajax({
      url: '/partial/item-box'
    })

      .error(cb)

      .success(function (data) {
        item.template = $(data);

        app.cache.template.item = item.template;

        cb(null, item.template);
      });

    return this;
  };

  Item.prototype.find = function (name) {
    switch ( name ) {
      case 'subject':
        return this.template.find('.item-title:first a');

      case 'description':
        return this.template.find('.description:first');

      case 'reference':
        return this.template.find('.item-references:first a');

      case 'media':
        return this.template.find('.item-media:first');

      case 'youtube preview':
        return this.template.find('.youtube-preview:first');

      case 'toggle promote':
        return this.template.find('.toggle-promote:first');

      case 'promote':
        return this.template.find('.evaluator:first');

      case 'toggle details':
        return this.template.find('.toggle-details:first');

      case 'details':
        return this.template.find('.details:first');

      case 'toggle arrow':
        return this.template.find('>.toggle-arrow');

      case 'promotions':
        return this.template.find('.promoted:first');

      case 'promotions %':
        return this.template.find('.promoted-percent:first');

      case 'children':
        return this.template.find('.children:first');
    }
  };

  Item.prototype.render = function (cb) {

    var item = this;

    // Create reference to promote

    var promote = new Promote(this);

    // Create reference to details

    var details = new Details(this);

    // Set ID

    item.template.attr('id', 'item-' + item.item._id);

    // Set Data

    item.template.data('item', this);

    // Subject

    item.find('subject').text(item.item.subject);

    // Description

    item.find('description').text(item.item.description);

    // Media

    item.find('media').empty().append(this.media());

    // References

    if ( item.item.references.length ) {
      item.find('reference')
        .attr('href', item.item.references[0].url)
        .text(item.item.references[0].title || item.item.references[0].url);
    }
    else {
      item.find('reference').empty();
    }

    // Number of promotions

    item.find('promotions').text(item.item.promotions);

    // Percent of promotions

    item.find('promotions %').text(Math.ceil(item.item.promotions * 100 / item.item.views) + '%');

    // Toggle promote

    item.find('toggle promote').on('click', function () {

      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');

      Nav.toggle(item.find('promote'), item.template, app.domain.intercept(function () {
        promote.render(app.domain.intercept());
      }));
    });

    // Toggle details

    item.find('toggle details').on('click', function () {
      
      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');

      Nav.toggle(item.find('details'), item.template, app.domain.intercept(function () {
        details.render(app.domain.intercept());
      }));

    });

    // Toggle arrow

    item.find('toggle arrow').on('click', function () {

      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');
      var arrow   =   $(this).find('i');

      Nav.toggle(item.find('children'), item.template, app.domain.intercept(function () {

        if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

          switch ( item.item.type ) {
            case 'Topic':

              item.find('children').addClass('is-loaded');

              var panelProblem = new Panel('Problem', item.item._id);

              panelProblem.get(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelProblem.render(app.domain.intercept(function () {
                    panelProblem.fill(app.domain.intercept());
                  }));
                }, 700);
              }));
              break;

            case 'Problem':

              var panelSolution = new Panel('Solution', item.item._id);

              panelSolution.get(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelSolution.render(app.domain.intercept(function () {
                    panelSolution.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var split = $('<div class="row"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelAgree = new Panel('Agree', item.item._id);

              panelAgree.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelAgree.render(app.domain.intercept(function () {
                    panelAgree.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelDisagree = new Panel('Disagree', item.item._id);

              panelDisagree.get(app.domain.intercept(function (template) {
                template.addClass('split-view');
                
                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelDisagree.render(app.domain.intercept(function () {
                    panelDisagree.fill(app.domain.intercept());
                  }));
                }, 700);
              }));
              break;

            case 'Solution':

              var split = $('<div class="row"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelPro = new Panel('Pro', item.item._id);

              panelPro.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelPro.render(app.domain.intercept(function () {
                    panelPro.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelCon = new Panel('Con', item.item._id);

              panelCon.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelCon.render(app.domain.intercept(function () {
                    panelCon.fill(app.domain.intercept());
                  }));
                }, 700);
              }));
              break;
          }
        }

        if ( arrow.hasClass('fa-arrow-down') ) {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
        else {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
      }));
    });

    cb();
  };

  Item.prototype.media = function () {

    // youtube video from references

    if ( this.item.references.length ) {
      var media = YouTube(this.item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( this.item.image ) {

      var src = this.item.image;

      if ( ! /^http/.test(this.item.image) ) {
        src = synapp['default item image'];
      }

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

      return image;
    }

    if ( this.item.youtube ) {
      return YouTube('http://youtube.com/watch?v=' + this.item.youtube);
    }

    if ( this.item.upload ) {
      var src = this.item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', this.item.upload);

      return image;
    }

    // default image

    var image = $('<img/>');

    image.addClass('img-responsive');

    image.attr('src', synapp['default item image']);

    return image;
  };

  module.exports = Item;

} ();

},{"./Details":"/home/francois/Dev/syn/app/web2/js2/Details.js","./Nav":"/home/francois/Dev/syn/app/web2/js2/Nav.js","./Promote":"/home/francois/Dev/syn/app/web2/js2/Promote.js","./YouTube":"/home/francois/Dev/syn/app/web2/js2/YouTube.js"}],"/home/francois/Dev/syn/app/web2/js2/Nav.js":[function(require,module,exports){
! function () {

  'use strict';

  function toggle (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    if ( elem.hasClass('is-shown') ) {
      unreveal(elem, poa, cb);
    }
    else {
      reveal(elem, poa, cb);
    }
  }

  function reveal (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    console.log('%c reveal', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : '<no id>'), elem.attr('class'));

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-hidden').addClass('is-showing');

    if ( poa ) {
      scroll(poa, function () {
        show(elem, cb);
      });
    }

    else {
      show(elem, cb);
    }
  }

  function unreveal (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    console.log('%c unreveal', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-shown').addClass('is-hiding');

    if ( poa ) {
      scroll(poa, function () {
        hide(elem, cb);
      });
    }

    else {
      hide(elem, cb);
    }
  }

  function scroll (pointOfAttention, cb, speed) {
    console.log('%c scroll', 'font-weight: bold',
      (pointOfAttention.attr('id') ? '#' + pointOfAttention.attr('id') + ' ' : ''), pointOfAttention.attr('class'));

    var poa = (pointOfAttention.offset().top - 80);

    var current = $('body,html').scrollTop();

    if ( typeof cb !== 'function' ) {
      cb = function () {};
    }

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html')
      .animate({
        scrollTop: poa + 'px'
      }, 500, 'swing'))
      .then(cb);
  }

  function show (elem, cb) {
    if ( typeof cb !== 'function' ) {
      cb = function () {};
    }

    console.log('%c show', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker
    
    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      cb(new Error('Show failed'));
      return false;
    }

    // make sure margin-top is equal to height for smooth scrolling

    elem.css('margin-top', '-' + elem.height() + 'px');

    // animate is-section

    $.when(elem.find('.is-section:first')
      .animate({
        marginTop: 0
      }, 500))
    .then(function () {
      elem.removeClass('is-showing').addClass('is-shown');
        
      if ( elem.css('margin-top') !== 0 ) {
        elem.animate({'margin-top': 0}, 250);
      }
      
      if ( cb ) {
        cb();
      }      
    });

    elem.animate({
       opacity: 1
      }, 500);
  }

  function hide (elem, cb) {
    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      return false;
    }

    console.log('%c hide', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    elem.removeClass('is-shown').addClass('is-hiding');;

    elem.find('.is-section:first').animate(
      {
        'margin-top': '-' + elem.height() + 'px',
        // 'padding-top': elem.height() + 'px'
      },

      1000,

      function () {
        elem.removeClass('is-hiding').addClass('is-hidden');

        if ( cb ) cb();
      });

    elem.animate({
       opacity: 0
      }, 1000);
  }

  module.exports = {
    toggle:       toggle,
    reveal:       reveal,
    unreveal:     unreveal,
    show:         show,
    hide:         hide,
    scroll:       scroll
  };

} ();

},{}],"/home/francois/Dev/syn/app/web2/js2/Panel.js":[function(require,module,exports){
! function () {

  'use strict';

  var Nav       =   require('./Nav');
  var Creator   =   require('./Creator');
  var Item      =   require('./Item');

  /**
   *  @class
   *
   *  @arg {String} type
   *  @arg {String?} parent
   */

  function Panel (type, parent, size, skip) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var panel = this;

    if ( typeof type !== 'string' ) {
      throw new TypeError('Missing Panel Type string');
    }

    this.type     =   type;
    this.parent   =   parent;
    this.skip     =   skip || 0;
    this.size     =   size || synapp['navigator batch size'];

    this.id       =   'panel-' + this.type;

    if ( this.parent ) {
      this.id += '-' + this.parent;
    }
  }

  // require('util').inherits(Panel, require('events').EventEmitter);

  Panel.prototype.getId = function () {
    var id = 'panel-' + this.type;

    if ( this.parent ) {
      id += '-' + this.parent;
    }

    return id;
  };

  Panel.prototype.get = function (cb) {
    var panel = this;

    $.ajax({
      url: '/partial/panel'
    })

      .error(cb)

      .success(function (data) {
        panel.template = $(data);

        cb(null, panel.template);
      });

    return this;
  };

  Panel.prototype.find = function (name) {
    switch ( name ) {
      case 'title':
        return this.template.find('.panel-title:first');

      case 'toggle creator':
        return this.template.find('.toggle-creator:first');

      case 'creator':
        return this.template.find('.creator:first');

      case 'items':
        return this.template.find('.items:first');

      case 'load more':
        return this.template.find('.load-more:first');
    }
  };

  Panel.prototype.toggleCreator = function (target) {
    if ( synapp.user ) {
      Nav.toggle(this.find('creator'), this.template, app.domain.intercept());
    }
  };

  Panel.prototype.render = function (cb) {

    var panel = this;

    this.find('title').text(this.type);

    this.find('toggle creator').on('click', function () {
      panel.toggleCreator($(this));
    });

    panel.template.attr('id', panel.getId());

    var creator = new Creator(panel);

    creator.render(app.domain.intercept(function () {
      cb();     
    }));

    this.find('load more').on('click', function () {
      panel.fill();
      return false;
    });

    return this;
  };

  Panel.prototype.toJSON = function () {
    var json = {
      type: this.type,
      size: this.size,
      skip: this.skip
    };

    if ( this.parent ) {
      json.parent = this.parent;
    }

    return json;
  };

  Panel.prototype.fill = function () {
    var self = this;

    app.socket.emit('get items', this.toJSON());

    app.socket.once('got items ' + this.id, function (panel, items) {
      
      console.log(panel, items, self.toJSON());

      self.skip += items.length;

      return self.insertItem(items, 0);

      require('async').series(
        items.map(function (_item) {
          return function (cb) {

            var item  = new Item(this);

            console.log('get item template', item.item.subject)

            item.get(app.domain.intercept(function () {
              console.log('inserting item', item.item.subject)

              self.find('items').append(item.template);
              cb();
              // item.render(cb);
            }));
          }.bind(_item);
        }),

        app.domain.intercept(function () {
          console.log('filling done', items.length)
        }));
    });
  };

  Panel.prototype.insertItem = function (items, i) {

    var self = this;

    if ( items[i] ) {

      console.log('rendering item', items[i].subject);

      var item  = new Item(items[i]);

      item.get(app.domain.intercept(function (template) {
        self.find('items').append(template);

        item.render(app.domain.intercept(function () {
          self.insertItem(items, ++ i);
        }));

      }));
    }
  };

  module.exports = Panel;

  window.Panel = Panel;

} ();

},{"./Creator":"/home/francois/Dev/syn/app/web2/js2/Creator.js","./Item":"/home/francois/Dev/syn/app/web2/js2/Item.js","./Nav":"/home/francois/Dev/syn/app/web2/js2/Nav.js","async":"/home/francois/Dev/syn/app/web2/node_modules/async/lib/async.js"}],"/home/francois/Dev/syn/app/web2/js2/Promote.js":[function(require,module,exports){
! function () {

  'use strict';

  var Item = require('./Item');

  var Nav = require('./Nav');

  function Promote (item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || item.constructor.name !== 'Item' ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('promote');

      if ( ! self.template.length ) {
        throw new Error('Template not found');
      }

      self.watch = new (require('events').EventEmitter)();

      self.$bind('limit', self.renderLimit.bind(self));

      self.$bind('cursor', self.renderCursor.bind(self));

      self.$bind('left', self.renderLeft.bind(self));

      self.$bind('right', self.renderRight.bind(self));
    });
      
  }

  Promote.prototype.find = function (name, more) {
    switch ( name ) {
      case 'cursor':
        return this.template.find('.cursor');

      case 'limit':
        return this.template.find('.limit');

      case 'side by side':
        return this.template.find('.items-side-by-side');

      case 'item subject':
        return this.find('side by side').find('.subject.' + more + '-item h3');

      case 'item description':
        return this.find('side by side').find('.is-des.' + more + '-item .description');

      case 'sliders':
        return this.find('side by side').find('.sliders.' + more + '-item');

      case 'promote button':
        return this.find('side by side').find('.' + more + '-item .promote');
    }
  };

  Promote.prototype.renderLimit = function () {
    this.find('limit').text(this.evaluation.limit);
  };

  Promote.prototype.renderCursor = function () {
    this.find('cursor').text(this.evaluation.cursor);
  };

  Promote.prototype.renderLeft = function () {
    this.renderItem('left');
  };

  Promote.prototype.renderRight = function () {
    this.renderItem('right');
  };

  Promote.prototype.renderItem = function (hand) {
    var self = this;

    if ( ! this.evaluation[hand] ) {
      this.find('item subject', hand).hide();
      this.find('item description', hand).hide();

      return;
    }

    // Increment views counter

    app.socket.emit('add view', this.evaluation[hand]._id);

    this.find('item subject', hand).text(this.evaluation[hand].subject);

    this.find('item description', hand).text(this.evaluation[hand].description);

    self.find('sliders', hand).find('h4').each(function (i) {
      var cid = i;

      if ( cid > 3 ) {
        cid -= 4;
      }

      self.find('sliders', hand).find('h4').eq(i).text(self.evaluation.criterias[cid].name);
    });

    self.find('promote button', hand)
      .text(this.evaluation[hand].subject)
      .on('click', function () {
        Nav.scroll(self.template, app.domain.intercept(function () {
          self.edit('cursor', self.evaluation.cursor + 1);
        }));
      });
  };

  Promote.prototype.render = function (cb) {
    var promote = this;

    if ( ! this.evaluation ) {
      app.socket.emit('get evaluation', this.item.item);

      app.socket.once('got evaluation', function (evaluation) {
        console.log('got evaluation', evaluation);

        promote.evaluation = evaluation;

        promote.edit('limit', 5);

        promote.edit('cursor', 1);

        promote.edit('left', evaluation.items[0]);

        promote.edit('right', evaluation.items[1]);
      });
    }
  };

  Promote.prototype.edit = function (key, value) {
    this.evaluation[key] = value;

    this.watch.emit(key);
  };

  Promote.prototype.$bind = function (key, binder) {
    this.watch.on(key, binder);
  };

  module.exports = Promote;

} ();

},{"./Item":"/home/francois/Dev/syn/app/web2/js2/Item.js","./Nav":"/home/francois/Dev/syn/app/web2/js2/Nav.js","events":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js"}],"/home/francois/Dev/syn/app/web2/js2/Synapp.js":[function(require,module,exports){
! function () {

  'use strict';

  var Panel = require('./Panel');
  var domain = require('domain');

  function Synapp () {
    var self = this;

    self.Panel = Panel;

    this.domain = domain.create();

    this.domain.intercept = function (fn, _self) {

      if ( typeof fn !== 'function' ) {
        fn = function () {};
      }

      return function (error) {
        if ( error && error instanceof Error ) {
          self.domain.emit('error', error);
        }

        else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };

    };

    this.domain.on('error', function (error) {
      console.error(error);
    });

    this.socket = io.connect('http://' + location.hostname + ':' + location.port);

    this.socket.on('connect', this.topLevelPanel.bind(this));

    this.evaluations = [];

    this.cache = {
      template: {
        item: null
      }
    };

    console.info(synapp.user, $('.is-in'))

    if ( synapp.user ) {
      $('.is-in').removeClass('is-in');
    }
  }

  Synapp.prototype.topLevelPanel = function () {
    var self = this;

    var panel = new Panel('Topic');

    panel
      
      .get(self.domain.intercept(function (template) {

        $('.panels').append(template);

        setTimeout(function () {
          panel.render(self.domain.intercept(function () {
            panel.fill(self.domain.intercept());
          }));
        }, 700);
      }));
  };

  window.Synapp = Synapp;

} ();

},{"./Panel":"/home/francois/Dev/syn/app/web2/js2/Panel.js","domain":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js"}],"/home/francois/Dev/syn/app/web2/js2/Upload.js":[function(require,module,exports){
! function () {

  'use strict';

  function handler (e) {
    hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      parse(f);
      preview(f, e.target);
    }
  }

  function hover (e) {
    e.stopPropagation();
    e.preventDefault();
    // e.target.className = (e.type == "dragover" ? "hover" : "");
  }

  function parse (file) {
    console.warn('file parsed', file);
  }

  function preview (file, target) {

    var dropbox;

    if ( $(target).hasClass('drop-box') ) {
      dropbox = $(target);
    }
    else {
      dropbox = $(target).closest('.drop-box');
    }

    var img = new Image();

    img.classList.add("img-responsive");
    img.classList.add("preview-image");
    
    img.addEventListener('load', function () {
      $(img).insertAfter(dropbox);
      $(img).data('file', file);
      dropbox.css('display', 'none');
    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);
  }

  function init (dropbox) {

    if ( window.File ) {
      dropbox
        .on('dragover', hover)
        .on('dragleave', hover)
        .on('drop', handler)
        .find('input')
          .on('change', handler);
    }

    else {
      dropbox.find('.modern').hide();
    }
  }

  module.exports = init;

} ();

},{}],"/home/francois/Dev/syn/app/web2/js2/YouTube.js":[function(require,module,exports){
! function () {

  'use strict';

  function YouTube (url) {
    var self = this;

    var youtube;

    var regexYouTube = /youtu\.?be.+v=([^&]+)/;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });

      var raw = '<div class="youtube-preview" data-video="' + youtube + '"><img alt="YouTube" src="http://img.youtube.com/vi/' + youtube + '/hqdefault.jpg" class="img-responsive youtube-thumbnail" /><div class="icon-play"><i class="fa fa-youtube-play fa-5x"></i></div></div>';

      var elem = $(raw);

      Play(elem);

      return elem;
    }
  }

  function Play (elem) {
    setTimeout(function () {
      var img   =   elem.find('img');

      var icon  =   elem.find('.icon-play');

      icon.css('width', img.width() + 'px');

      icon.css('height', img.height() + 'px');

      img.css('margin-bottom', '-' + img.height() + 'px');

      $(window).on('resize', function () {

        icon.css('width', img.width() + 'px');

        img.css('margin-bottom', '-' + img.height() + 'px');
      });

      icon.find('.fa').on('click', function () {
        var video_container = $('<div class="video-container"></div>');

        var preview = $(this).closest('.youtube-preview');

        preview
          .empty()
          .append(video_container);

        video_container.append($('<iframe frameborder="0" width="300" height="175" allowfullscreen></iframe>'));

        video_container.find('iframe')
          .attr('src', 'http://www.youtube.com/embed/'
            + preview.data('video') + '?autoplay=1'); 
      });

      icon.show();

      icon.css('padding-top',
        ( ( img.height() / 2 ) - ( icon.find('.fa').height() / 2 ) )
          + 'px');
        
    }, 800);
  }

  module.exports = YouTube;

} ();

},{}],"/home/francois/Dev/syn/app/web2/node_modules/async/lib/async.js":[function(require,module,exports){
(function (process){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        var remainingTasks = keys.length
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = function () {};

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        }
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
                q.process();
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                q.process();
            }
        };
        return q;
    };
    
    async.priorityQueue = function (worker, concurrency) {
        
        function _compareTasks(a, b){
          return a.priority - b.priority;
        };
        
        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        
        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };
              
              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }
        
        // Start with a normal queue
        var q = async.queue(worker, concurrency);
        
        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        
        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'))
},{"_process":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js":[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events');

	// Export Domain
	var domain = {};
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter();
		d.run = function(fn){
			try {
				fn();
			}
			catch (err) {
				this.emit('error', err);
			}
			return this;
		};
		d.dispose = function(){
			this.removeAllListeners();
			return this;
		};
		return d;
	};
	return domain;
}).call(this);
},{"events":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js"}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},["/home/francois/Dev/syn/app/web2/js2/Synapp.js"]);
