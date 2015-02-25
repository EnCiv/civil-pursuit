(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  C   R   E   A   T   O   R

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Panel     =   require('./Panel');

  var text      =   {
    'looking up title': 'Looking up'
  };

  /**
   *  @class
   *  @arg {Panel} - panel
   */

  function Creator (panel) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    if ( ! ( panel instanceof require('./Panel') ) ) {
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

      case 'upload image button':
        return this.template.find('.upload-image-button');
    }
  };

  Creator.prototype.render      =   require('./Creator/render');

  Creator.prototype.create      =   require('./Creator/create');

  Creator.prototype.created     =   require('./Creator/created');

  Creator.prototype.packItem    =   require('./Creator/pack-item');

  module.exports = Creator;

} ();

},{"./Creator/create":2,"./Creator/created":3,"./Creator/pack-item":4,"./Creator/render":5,"./Panel":18}],2:[function(require,module,exports){
(function (process){
! function () {
  
  'use strict';

  var Nav       =   require('../Nav');
  var Item      =   require('../Item');
  var Stream    =   require('../Stream');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save () {

    // Self reference

    var creator = this;

    process.nextTick(function () {

      app.domain.run(function () {

        // Hide the Creator           // Catch errors

        Nav.hide(creator.template)    .error(app.domain.intercept())

          // Hiding complete

          .hidden(function () {
            
            // Build the JSON object to save to MongoDB

            creator.packItem();

            // In case a file was uploaded

            if ( creator.packaged.upload ) {

              // Get file from template's data

              var file = creator.template.find('.preview-image').data('file');

              // New stream         //  Catch stream errors

              new Stream(file)      .on('error', app.domain.intercept(function () {}))

                .on('end', function () {
                  creator.packaged.image = file.name;

                  console.log('create item', creator.packaged);

                  app.socket.emit('create item', creator.packaged);
                })
            }

            // If nof ile was uploaded

            else {
              console.log('create item', creator.packaged);

              app.socket.emit('create item', creator.packaged);
            }

            // Listen to answers

            app.socket.once('could not create item', app.domain.intercept());

            app.socket.once('created item', creator.created.bind(creator));
          })

      });

    });

    return false;
  }

  module.exports = save;

} ();

}).call(this,require('_process'))
},{"../Item":11,"../Nav":17,"../Stream":30,"_process":39}],3:[function(require,module,exports){
! function () {
  
  'use strict';

  var Item    =   require('../Item');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function created (item) {
    console.log('created item', item);

    this.panel.template.find('.create-new').hide();

    if ( this.packaged.upload ) {
      item.upload = this.packaged.upload;
    }

    if ( this.packaged.youtube ) {
      item.youtube = this.packaged.youtube;
    }

    var item  = new Item(item);

    var items = this.panel.find('items');

    item.load(app.domain.intercept(function () {
      items.prepend(item.template);
      item.render(app.domain.intercept(function () {
        item.find('toggle promote').click();
      }));
    }));
  }

  module.exports = created;

} ();

},{"../Item":11}],4:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function packItem () {
    
    var item = {
      type:           this.panel.type,
      subject:        this.find('subject').val(),
      description:    this.find('description').val(),
      user:           synapp.user
    };

    // Parent

    if ( this.panel.parent ) {
      item.parent = this.panel.parent;
    }

    // References

    if ( this.find('reference').val() ) {
      item.references = [{ url: this.find('reference').val() }];

      if ( this.find('reference board').text() && this.find('reference board').text() !== text['looking up title'] ) {
        item.references[0].title = this.find('reference board').text();
      }
    }

    // Image

    if ( this.find('item media').find('img').length ) {

      // YouTube

      if ( this.find('item media').find('.youtube-preview').length ) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      // Upload

      else {
        item.upload = this.find('item media').find('img').attr('src');
        item.image = item.upload;
      }
    }
 
    this.packaged = item;
  }

  module.exports = packItem;

} ();
          synapp.user
},{}],5:[function(require,module,exports){
! function () {
  
  'use strict';

  var Upload    =   require('../Upload');
  var Form      =   require('../Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function render (cb) {
    
    if ( ! this.template.length ) {
      return cb(new Error('Creator not found in panel ' + this.panel.getId()));  
    }

    var creator = this;

    creator.template.data('creator', this);

    this.find('upload image button').on('click', function () {
      creator.find('dropbox').find('[type="file"]').click();
    });

    new Upload(creator.find('dropbox'), creator.find('dropbox').find('input'), creator.find('dropbox'));

    creator.template.find('textarea').autogrow();

    creator.find('reference').on('change', function () {

      var creator     =   $(this).closest('.creator').data('creator');

      var board       =   creator.find('reference board');
      var reference   =   $(this);

      board.removeClass('hide').text(text['looking up title']);

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
    
    form.send(creator.create.bind(creator));

    cb();
  }

  module.exports = render;

} ();

},{"../Form":9,"../Upload":33}],6:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  DETAILS

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav = require('./Nav');
  var Edit = require('./Edit');

  /**
   *  @class Details
   *  @arg {Item} item
   */

  function Details(item) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('./Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('details');

      if ( ! self.template.length ) {
        throw new Error('Template not found');
      }
    });
  }

  /**
   *  @method find
   *  @description DOM selectors abstractions
   *  @return null
   *  @arg {string} name
   */

  Details.prototype.find = function (name) {
    switch ( name ) {
      case 'promoted bar':
        return this.template.find('.progress-bar');

      case 'feedback list':
        return this.template.find('.feedback-list');

      case 'votes':
        return this.template.find('.details-votes');

      case 'toggle edit and go again':
        return this.template.find('.edit-and-go-again-toggler');
    }
  };

  /**
   *  @method render
   *  @description DOM manipulation
   *  @arg {function} cb
   */

  Details.prototype.render = function (cb) {
    var self = this;

    var item = self.item.item;

    self.find('promoted bar')
      .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
      .text(Math.floor(item.promotions * 100 / item.views) + '%');

    self.find('toggle edit and go again').on('click', function () {
      Nav.unreveal(self.template, self.item.template, app.domain.intercept(function () {
        if ( self.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new Edit(self.item);
            
          edit.get(app.domain.intercept(function (template) {

            self.item.find('editor').find('.is-section').append(template);

            Nav.reveal(self.item.find('editor'), self.item.template,
              app.domain.intercept(function () {
                Nav.show(template, app.domain.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

    if ( synapp.user ) {
      $('.is-in').removeClass('is-in');
    }

    if ( ! self.details ) {
      this.get();
    }
  };

  /**
   *  @method votes
   *  @description Display votes using c3.js
   *  @arg {object} criteria
   *  @arg {HTMLElement} svg
   */

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

  /**
   *
   */

  Details.prototype.get = function () {

    var self = this;

    app.socket.emit('get item details', self.item.item._id);

    app.socket.once('got item details', function (details) {

      console.log('got item details', details);

      self.details = details;

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
  };

  module.exports = Details;

} ();

},{"./Edit":7,"./Item":11,"./Nav":17}],7:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  EDIT

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

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

  function Edit (item) {

    console.log('EDIT', item)

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('./Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;
    });
  }

  Edit.prototype.get = function (cb) {
    var edit = this;

    $.ajax({
      url: '/partial/creator'
    })

      .error(cb)

      .success(function (data) {
        edit.template = $(data);

        cb(null, edit.template);
      });

    return this;
  };

  Edit.prototype.find = function (name) {
    switch ( name ) {
      case 'create button':
        return this.template.find('.button-create:first');

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

  Edit.prototype.render = function (cb) {

    var edit = this;

    // this.template.find('textarea').autogrow();

    this.template.find('[name="subject"]').val(edit.item.item.subject);
    this.template.find('[name="description"]')
      .val(edit.item.item.description)
      .autogrow();

    if ( edit.item.item.references.length ) {
      this.template.find('[name="reference"]').val(edit.item.item.references[0].url);
    }

    this.template.find('.item-media')
      .empty()
      .append(edit.item.media());

    this.template.on('submit', function () {

      edit.save();

      return false;
    });

    return this;
  };

  Edit.prototype.save = require('./Edit/save');

  Edit.prototype.toItem = function () {
    var item = {
      from:         this.item.item._id,
      subject:      this.find('subject').val(),
      description:  this.find('description').val(),
      user:         synapp.user,
      type:         this.item.item.type
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

  module.exports = Edit;

} ();

},{"./Creator":1,"./Edit/save":8,"./Item":11,"./Nav":17}],8:[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save () {
    var edit = this;

    console.log(edit.toItem());

    Nav.hide(edit.template, app.domain.intercept(function () {
      Nav.hide(edit.template.closest('.editor'), app.domain.intercept(function () {
        
        var new_item = edit.toItem();

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', function (error) {
          console.error(error)
        });
        
        app.socket.once('created item', function (item) {
          console.log('created item', item);

            if ( new_item.upload ) {
              item.upload = new_item.upload;
            }

            if ( new_item.youtube ) {
              item.youtube = new_item.youtube;
            }

            var item  = new (require('../Item'))(item);

            item.load(app.domain.intercept(function () {
              item.template.insertBefore(edit.item.template);
              
              item.render(app.domain.intercept(function () {
                item.find('toggle promote').click();
              }));
            }));
        });
      }));
    }));
  }

  module.exports = save;

} ();

},{"../Item":11,"../Nav":17}],9:[function(require,module,exports){
/*
 *  F   O   R   M
 *  *****************
*/

! function () {

  'use strict';

  /**
   *  @class    Form
   *  @arg      {HTMLElement} form
   */

  function Form (form) {
    console.log('new Form', form)
    var self = this;

    this.form = form;

    this.form.on('submit', function () {
      setTimeout(self.submit.bind(self));

      return false;
    });
  }

  Form.prototype.submit = function () {

    console.warn('submitting', this.form.attr('name'))

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

},{}],10:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  INTRO

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function Intro () {

  'use strict';

  var Truncate = require('./Truncate');
  var Item = require('./Item');
  var readMore = require('./ReadMore');

  function Intro () {

  }

  Intro.prototype.render = function () {
    app.socket.emit('get intro');

    app.socket.on('got intro', function (intro) {

      console.warn('got intro')

      $('#intro').find('.panel-title').text(intro.subject);

      $('#intro').find('.item-subject').text(intro.subject);
      // $('#intro').find('.item-title').hide();

      readMore(intro, $('#intro'));

      $('#intro').find('.item-reference').remove();
      $('#intro').find('.item-buttons').remove();
      $('#intro').find('.item-arrow').remove();

      // adjustBox($('#intro .item'));

      $('#intro').find('.item-media')
        .empty().append(new Item(intro).media());

      setTimeout(function () {
        //new Truncate($('#intro'));
      });
    });
  };

  module.exports = Intro;

} ();

},{"./Item":11,"./ReadMore":26,"./Truncate":32}],11:[function(require,module,exports){
/*
 *   ::    I   t   e   m     ::
 *
 *
*/

! function _Item_ () {
  
  'use strict';

  /**
    * @class  Item
    * @arg    {Item} item
    */

  function Item (item) {

    if ( typeof app === 'undefined' || ! ( app instanceof Synapp ) ) {
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

  Item.prototype.load       =   require('./Item/load');

  Item.prototype.find       =   require('./Item/find');

  Item.prototype.render     =   require('./Item/render');

  Item.prototype.media      =   require('./Item/media');

  module.exports = Item;

} ();

},{"./Item/find":12,"./Item/load":13,"./Item/media":14,"./Item/render":15}],12:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function find (name) {
    switch ( name ) {
      case 'subject':
        return this.template.find('.item-subject:first a');

      case 'description':
        return this.template.find('.item-description:first');

      case 'reference':
        return this.template.find('.item-reference:first a');

      case 'media':
        return this.template.find('.item-media:first');

      case 'youtube preview':
        return this.template.find('.youtube-preview:first');

      case 'toggle promote':
        return this.template.find('.item-toggle-promote:first');

      case 'promote':
        return this.template.find('.promote:first');

      case 'toggle details':
        return this.template.find('.item-toggle-details:first');

      case 'details':
        return this.template.find('.details:first');

       case 'editor':
        return this.template.find('.editor:first');

      case 'toggle arrow':
        return this.template.find('.item-arrow:first');

      case 'promotions':
        return this.template.find('.promoted:first');

      case 'promotions %':
        return this.template.find('.promoted-percent:first');

      case 'children':
        return this.template.find('.children:first');
    }
  }

  module.exports = find;

} ();

},{}],13:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function load (cb) {
    var item = this;

    $.ajax({
      url: '/partial/item'
    })

      .error(cb)

      .success(function (data) {
        item.template = $(data);

        app.cache.template.item = item.template;

        cb(null, item.template);
      });

    return this;
  }

  module.exports = load;

} ();

},{}],14:[function(require,module,exports){
! function () {
  
  'use strict';

  var YouTube     =   require('../YouTube');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function itemMedia () {

    // youtube video from references

    if ( this.item.references && this.item.references.length ) {
      var media = YouTube(this.item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( this.item.image && /^http/.test(this.item.image) ) {

      var src = this.item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

      return image;
    }

    // YouTube Cover Image

    if ( this.item.youtube ) {
      return YouTube('http://youtube.com/watch?v=' + this.item.youtube);
    }

    // Uploaded image

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
  }

  module.exports = itemMedia;

} ();

},{"../YouTube":34}],15:[function(require,module,exports){
! function () {
  
  'use strict';

  var Truncate    =   require('../Truncate');
  var Promote     =   require('../Promote');
  var Details     =   require('../Details');
  var Nav         =   require('../Nav');
  var readMore    =   require('../ReadMore');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function render (cb) {
  
    var item = this;

    // Create reference to promote

    this.promote = new Promote(this);

    // Create reference to details

    this.details = new Details(this);

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

    if ( (item.item.references) && item.item.references.length ) {
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

    // Truncate

    // setTimeout(function () {
    //   new Truncate(item.template);
    // }, 800);

    readMore(item.item, item.template);

    // Toggle promote

    console.log('wew', item.template)

    item.find('toggle promote').on('click', require('./view/toggle-promote'));

    // Toggle details

    item.find('toggle details').on('click', function () {
      
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');

      function showHideCaret () {
        if ( item.find('details').hasClass('is-shown') ) {
          $trigger.find('.caret').removeClass('hide');
        }
        else {
          $trigger.find('.caret').addClass('hide');
        }
      }

      if ( item.find('promote').hasClass('is-showing') ) {
        return false;
      }

      if ( item.find('promote').hasClass('is-shown') ) {
        item.find('toggle promote').find('.caret').addClass('hide');
        Nav.hide(item.find('promote'));
      }

      var hiders = $('.details.is-shown');

      Nav.toggle(item.find('details'), item.template, app.domain.intercept(function () {

        showHideCaret();

        if ( item.find('details').hasClass('is-shown') ) {

          if ( ! item.find('details').hasClass('is-loaded') ) {
            item.find('details').addClass('is-loaded');

            item.details.render(app.domain.intercept());
          }

          if ( hiders.length ) {
            Nav.hide(hiders);
          }
        }
      }));

    });

    // Toggle arrow

    item.find('toggle arrow')
      .removeClass('hide')
      .on('click', function () {

      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');
      var arrow   =   $(this).find('i');

      Nav.toggle(item.find('children'), item.template, app.domain.intercept(function () {

        if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

          switch ( item.item.type ) {
            case 'Topic':

              item.find('children').addClass('is-loaded');

              var panelProblem = new (require('../Panel'))('Problem', item.item._id);

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

              var panelSolution = new (require('../Panel'))('Solution', item.item._id);

              panelSolution.get(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelSolution.render(app.domain.intercept(function () {
                    panelSolution.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var split = $('<div class="row padding-bottom"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelAgree = new (require('../Panel'))('Agree', item.item._id);

              panelAgree.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelAgree.render(app.domain.intercept(function () {
                    panelAgree.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelDisagree = new (require('../Panel'))('Disagree', item.item._id);

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

              var split = $('<div class="row padding-bottom"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelPro = new (require('../Panel'))('Pro', item.item._id);

              panelPro.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelPro.render(app.domain.intercept(function () {
                    panelPro.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelCon = new (require('../Panel'))('Con', item.item._id);

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
  }

  module.exports = render;

} ();

},{"../Details":6,"../Nav":17,"../Panel":18,"../Promote":19,"../ReadMore":26,"../Truncate":32,"./view/toggle-promote":16}],16:[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('../../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function togglePromote () {

    var $trigger    =   $(this);
    var $item       =   $trigger.closest('.item');
    var item        =   $item.data('item');

    console.log('hegdhsfhgdfhgsdghsghfds')

    function hideOthers () {
      if ( $('.is-showing').length || $('.is-hidding').length ) {
        return false;
      }

      if ( $('.creator.is-shown').length ) {
        Nav
          .hide($('.creator.is-shown'))
          .hidden(function () {
            $trigger.click();
          });

        return false;
      }

      if ( item.find('details').hasClass('is-shown') ) {
        Nav
          .hide(item.find('details'))
          .hidden(function () {
            $trigger.click();
          });

        item.find('toggle details').find('.caret').addClass('hide');

        return false;
      }
    }

    function promote () {
      item.promote.get(app.domain.intercept(item.promote.render.bind(item.promote)));
    }

    function showHideCaret () {
      if ( item.find('promote').hasClass('is-shown') ) {
        $trigger.find('.caret').removeClass('hide');
      }
      else {
        $trigger.find('.caret').addClass('hide');
      }
    }

    if ( hideOthers() === false ) {
      return false;
    }

    Nav.toggle(item.find('promote'), item.template, function (error) {

      promote();

      showHideCaret();

    });

  }

  module.exports = togglePromote;

} ();

},{"../../Nav":17}],17:[function(require,module,exports){
(function (process){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  N   A   V

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

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

  /**
   *  @function
   *  @return
   *  @arg
   */

  function reveal (elem, poa, cb) {
    var emitter = new (require('events').EventEmitter)();

    emitter.revealed = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {
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
          show(elem, function () {
            emitter.emit('success');
            cb();
          });
        });
      }

      else {
        show(elem, function () {
          emitter.emit('success');
          cb();
        });
      }
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

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

  /**
   *  @function scroll
   *  @description Scroll the page till the point of attention is at the top of the screen
   *  @return null
   *  @arg {function} pointOfAttention - jQuery List
   *  @arg {function} cb - Function to call once scroll is complete
   *  @arg {number} speed - A number of milliseconds to set animation duration
   */

  function scroll (pointOfAttention, cb, speed) {
    // console.log('%c scroll', 'font-weight: bold',
    //   (pointOfAttention.attr('id') ? '#' + pointOfAttention.attr('id') + ' ' : ''), pointOfAttention.attr('class'));

    var emitter = new (require('events').EventEmitter)();

    emitter.scrolled = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    emitter.then = function (fn, fn2) {
      emitter.on('success', fn);
      if ( fn2 ) emitter.on('error', fn2);
      return this;
    };

    var poa = (pointOfAttention.offset().top - 60);

    var current = $('body,html').scrollTop();

    if ( typeof cb !== 'function' ) {
      cb = function () {};
    }

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      emitter.emit('success');

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html').animate({ scrollTop: poa + 'px' }, 500, 'swing'))
      
      .then(function () {

        emitter.emit('success');

        if ( typeof cb === 'function' ) {
          cb();
        }

      });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function show (elem, cb) {

    var emitter = new (require('events').EventEmitter)();

    emitter.shown = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {

      console.log('%c show', 'font-weight: bold',
        (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker
      
      if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {

        emitter.emit('error', new Error('Already in progress'));
        
        if ( typeof cb === 'function' ) {
          cb(new Error('Show failed'));
        }

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

        emitter.emit('success');
        
        if ( cb ) {
          cb();
        }      
      });

      elem.animate({
         opacity: 1
        }, 500);

    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function hide (elem, cb) {
    var emitter = new (require('events').EventEmitter)();

    emitter.hiding = function (cb) {
      this.on('hiding', cb);
      return this;
    };

    emitter.hidden = function (cb) {
      this.on('hidden', cb);
      return this;
    };

    emitter.error = function (cb) {
      this.on('error', cb);
      return this;
    };

    process.nextTick(function () {

      var domain = require('domain').create();

      domain.on('error', function (error) {
        emitter.emit('error', error);
      });

      domain.run(function () {

        // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

        if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
          emitter.emit('bounced');
          return false;
        }

        emitter.emit('hiding');

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

            emitter.emit('hidden');

            if ( cb ) cb();
          });

        elem.animate({
           opacity: 0
          }, 1000);

      });

    })

    return emitter;
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

}).call(this,require('_process'))
},{"_process":39,"domain":36,"events":37}],18:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  PANEL

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav       =   require('./Nav');
  var Creator   =   require('./Creator');
  var Item      =   require('./Item');
  var Sign      =   require('./Sign');

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

      case 'create new':
        return this.template.find('.create-new:first');
    }
  };

  Panel.prototype.toggleCreator = function (target) {
    if ( synapp.user ) {
      Nav.toggle(this.find('creator'), this.template, app.domain.intercept());
    }
    else {
      Sign.dialog.join();
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

    this.find('create new').on('click', function () {
      panel.find('toggle creator').click();
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

  /**
   *  @method fill
   *  @arg {function} cb
   **/

  Panel.prototype.fill = function (cb) {
    var self = this;

    app.socket.emit('get items', this.toJSON());

    app.socket.once('got items ' + this.id, function (panel, items) {
      
      console.log('got items', panel, items)

      self.template.find('.hide.pre').removeClass('hide');
      self.template.find('.show.pre').removeClass('show').hide();

      if ( items.length ) {

        self.find('create new').hide();
        self.find('load more').show();

        if ( items.length < synapp['navigator batch size'] ) {
          self.find('load more').hide();
        }

        self.skip += items.length;

        self.insertItem(items, 0, cb);
      }

      else {
        self.find('create new').show();
        self.find('load more').hide();
      }

        
    });
  };

  Panel.prototype.insertItem = function (items, i, cb) {

    var self = this;

    if ( items[i] ) {

      var item  = new Item(items[i]);

      item.load(app.domain.intercept(function (template) {
        self.find('items').append(template);

        item.render(app.domain.intercept(function () {
          self.insertItem(items, ++ i, cb);
        }));

      }));
    }
    else {
      cb && cb();
    }
  };

  module.exports = Panel;

} ();

},{"./Creator":1,"./Item":11,"./Nav":17,"./Sign":27}],19:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  P   R   O   M   O   T   E

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Item      =   require('./Item');
  var Nav       =   require('./Nav');
  var Edit      =   require('./Edit');

  /**
   *  @class Promote
   *  @arg {Item} item
   */

  function Promote (item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('./Item') ) ) {
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

  /**
   *  @method renderLimit
   */

  Promote.prototype.renderLimit = function () {
    this.find('limit').text(this.evaluation.limit);
  };

  /**
   *
   */

  Promote.prototype.renderCursor = function () {
    this.find('cursor').text(this.evaluation.cursor);
  };

  /**
   *
   */

  Promote.prototype.renderLeft = function () {
    this.renderItem('left');
  };

  /**
   *
   */

  Promote.prototype.edit = function (key, value) {
    this.evaluation[key] = value;

    this.watch.emit(key);
  };

  /**
   *
   */

  Promote.prototype.$bind = function (key, binder) {
    this.watch.on(key, binder);
  };

  /**
   *
   */

  /**
   *
   */

  Promote.prototype.renderRight = function () {
    this.renderItem('right');
  };

  /**
   *  @description Selector aliases getter
   */

  Promote.prototype.find            =     require('./Promote/find');

  /**
   *  @description render one of the sides in a side by side
   */

  Promote.prototype.renderItem      =     require('./Promote/render-item');

  /**
   *  @description
   */

  Promote.prototype.render          =     require('./Promote/render');

  /**
   *  @description
   */

  Promote.prototype.get             =     require('./Promote/get');

  /**
   *  @description
   */

  Promote.prototype.finish          =     require('./Promote/finish');

  /**
   *  @description
   */

  Promote.prototype.save            =     require('./Promote/save');

  module.exports = Promote;

} ();

},{"./Edit":7,"./Item":11,"./Nav":17,"./Promote/find":20,"./Promote/finish":21,"./Promote/get":22,"./Promote/render":24,"./Promote/render-item":23,"./Promote/save":25,"events":37}],20:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function find (name, more) {
    switch ( name ) {
      case 'cursor':
        return this.template.find('.cursor');

      case 'limit':
        return this.template.find('.limit');

      case 'side by side':
        return this.template.find('.items-side-by-side');

      case 'finish button':
        return this.template.find('.finish');

      case 'item subject':
        return this.find('side by side').find('.subject.' + more + '-item h3');

      case 'item description':
        return this.find('side by side').find('.is-des.' + more + '-item .description');

      case 'sliders':
        return this.find('side by side').find('.sliders.' + more + '-item');

      case 'item image':
        return this.find('side by side').find('.image.' + more + '-item');

      case 'item persona':
        return this.find('side by side').find('.persona.' + more + '-item');

      case 'item persona image':
        return this.find('item persona', more).find('img');

      case 'item persona name':
        return this.find('item persona', more).find('.user-full-name');

      case 'item feedback':
        return this.find('side by side').find('.' + more + '-item .feedback');

      case 'promote button':
        return this.find('side by side').find('.' + more + '-item .promote');

      case 'promote label':
        return this.find('side by side').find('.promote-label');

      case 'edit and go again button':
        return this.find('side by side').find('.' + more + '-item .edit-and-go-again-toggle');
    }
  }

  module.exports = find;

} ();

},{}],21:[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function finish () {
    var promote = this;

    promote.find('promote button').off('click');
    promote.find('finish button').off('click');

    if ( promote.evaluation.left ) {
      this.save('left');
    }

    if ( promote.evaluation.right ) {
      this.save('right');
    }

    Nav.unreveal(promote.template, promote.item.template,
      app.domain.intercept(function () {

        promote.item.details.get();

        promote.item.find('toggle details').click();

        promote.item.find('details').find('.feedback-pending')
          .removeClass('hide');

        promote.evaluation = null;
      }));
  }

  module.exports = finish;

} ();

},{"../Nav":17}],22:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function get (cb) {
    var promote = this;

    if ( ! this.evaluation ) {

      // Get evaluation via sockets

      app.socket.emit('get evaluation', this.item.item._id);

      app.socket.once('got evaluation', function (evaluation) {
        console.info('got evaluation', evaluation);

        promote.evaluation = evaluation;

        var limit = 5;

        if ( evaluation.items.length < 6 ) {
          limit = evaluation.items.length - 1;

          if ( ! evaluation.limit && evaluation.items.length === 1 ) {
            limit = 1;
          }
        }

        promote.edit('limit', limit);

        promote.edit('cursor', 1);

        promote.edit('left', evaluation.items[0]);

        promote.edit('right', evaluation.items[1]);

        cb();

      });
    }

    else {
      cb();
    }
  }

  module.exports = get;

} ();

},{}],23:[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function renderItem (hand) {
    var promote = this;

    var reverse = hand === 'left' ? 'right' : 'left';

    if ( ! this.evaluation[hand] ) {
      this.find('item subject', hand).hide();
      this.find('item description', hand).hide();
      this.find('item feedback', hand).hide();
      this.find('sliders', hand).hide();
      this.find('promote button', hand).hide();
      this.find('promote label').hide();
      this.find('edit and go again button', hand).hide();
      this.find('promote button', reverse).hide();
      this.find('edit and go again button', reverse).hide();
      // this.find('finish button').hide();
      return;
    }

    // Increment views counter

    app.socket.emit('add view', this.evaluation[hand]._id);

    // Subject

    this.find('item subject', hand).text(this.evaluation[hand].subject);

    // Description

    this.find('item description', hand).text(this.evaluation[hand].description);

    // Image

    this.find('item image', hand).empty().append(
      new (require('../Item'))(this.evaluation[hand]).media());

    // Sliders

    promote.find('sliders', hand).find('h4').each(function (i) {
      var cid = i;

      if ( cid > 3 ) {
        cid -= 4;
      }

      promote.find('sliders', hand).find('h4').eq(i).text(promote.evaluation.criterias[cid].name);
      promote.find('sliders', hand).find('input').eq(i)
        .val(0)
        .data('criteria', promote.evaluation.criterias[cid]._id);
    });

    // Persona

    promote.find('item persona image', hand).attr('src', promote.evaluation[hand].user.image);

    promote.find('item persona name', hand).text(promote.evaluation[hand].user.first_name);

    // Feedback

    promote.find('item feedback', hand).val('');

    // Feedback - remove any marker from previous post / see #164

    promote.find('item feedback', hand).removeClass('do-not-save-again');

    // Promote button

    promote.find('promote button', hand)
      .text(this.evaluation[hand].subject)
      .off('click')
      .on('click', function () {

        var left = $(this).closest('.left-item').length;

        var opposite = left ? 'right' : 'left';

        Nav.scroll(promote.template, app.domain.intercept(function () {

          // If cursor is smaller than limit, then keep on going
        
          if ( promote.evaluation.cursor < promote.evaluation.limit ) {

            promote.edit('cursor', promote.evaluation.cursor + 1);

            app.socket.emit('promote', promote.evaluation[left ? 'left' : 'right']._id);

            promote.save(left ? 'left' : 'right');

            $.when(
              promote
                .find('side by side')
                .find('.' + opposite + '-item')
                .animate({
                  opacity: 0
                })
            )
              .then(function () {
                promote.edit(opposite, promote.evaluation.items[promote.evaluation.cursor]);

                promote
                  .find('side by side')
                  .find('.' + opposite + '-item')
                  .animate({
                    opacity: 1
                  });
              });
          }

          // If cursor equals limit, means end of evaluation cycle

          else {

            promote.finish();

          }

        }));
      });
  
    // Edit and go again

    promote.find('edit and go again button', hand).on('click', function () {
      Nav.unreveal(promote.template, promote.item.template, app.domain.intercept(function () {
        return;

        if ( self.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new Edit(self.item);
            
          edit.get(app.domain.intercept(function (template) {

            self.item.find('editor').find('.is-section').append(template);

            Nav.reveal(self.item.find('editor'), self.item.template,
              app.domain.intercept(function () {
                Nav.show(template, app.domain.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

  }

  module.exports = renderItem;

} ();

},{"../Item":11,"../Nav":17}],24:[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('../Nav');

  /**
   *  @method Promote.render
   *  @return
   *  @arg
   */

  function render (cb) {
    var promote = this;

    promote.find('finish button').on('click', function () {
      Nav.scroll(promote.template, app.domain.intercept(function () {

        if ( promote.evaluation.cursor < promote.evaluation.limit ) {

          promote.save('left');

          promote.save('right');

          $.when(
            promote
              .find('side by side')
              .find('.left-item, .right-item')
              .animate({
                opacity: 0
              }, 1000)
          )
            .then(function () {
              promote.edit('cursor', promote.evaluation.cursor + 1);

              promote.edit('left', promote.evaluation.items[promote.evaluation.cursor]);

              promote.edit('cursor', promote.evaluation.cursor + 1);

              promote.edit('right', promote.evaluation.items[promote.evaluation.cursor]);

              promote
                .find('side by side')
                .find('.left-item')
                .animate({
                  opacity: 1
                }, 1000);

              promote
                .find('side by side')
                .find('.right-item')
                .animate({
                  opacity: 1
                }, 1000);
            });
        }

        else {

          promote.finish();

        }

      }));
    });
  }

  module.exports = render;

} ();

},{"../Nav":17}],25:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save (hand) {

    var promote = this;
   
    // feedback

    var feedback = promote.find('item feedback', hand);

    if ( feedback.val() ) {

      if ( ! feedback.hasClass('do-not-save-again') ) {
        app.socket.emit('insert feedback', {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          feedback: feedback.val()
        });

        feedback.addClass('do-not-save-again');
      }

      // feedback.val('');
    }

    // votes

    var votes = [];

    promote.template
      .find('.items-side-by-side:visible .' +  hand + '-item input[type="range"]:visible')
      .each(function () {
        var vote = {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          value: +$(this).val(),
          criteria: $(this).data('criteria')
        };

        votes.push(vote);
      });

    app.socket.emit('insert votes', votes);
  }

  module.exports = save;

} ();

},{}],26:[function(require,module,exports){
! function () {
  
  'use strict';

  function spanify (des) {

    return des.replace(/\n/g, "\n ").split(' ')

      .map(function (word) {
        var span = $('<span class="word"></span>');
        span.text(word + ' ');
        return span;
      });
  }

  function readMore (item, $item) {
    $item.find('.item-description').text('');

    spanify(item.description).forEach(function (word) {
      $item.find('.item-description').append(word);
    });

    var limit = $item.find('.item-media img').height();

    var top = $item.find('.item-text').offset().top;

    if ( $('body').width() >= $('#screen-tablet').width() ) {
      if ( $item.attr('id') !== 'intro' ) {
        top -= ($item.find('.item-subject').height());
      }

      else {
        top -= 40;
      }
    }
    else if ( $('body').width() >= $('#screen-phone').width() ) {
      limit *= 2;
    }

    for ( var i = $item.find('.item-description .word').length - 1; i >= 0; i -- ) {
      var word = $item.find('.item-description .word').eq(i);

      if ( (word.offset().top - top) > limit ) {
        word.addClass('hidden-word').hide();
      }
    }

    if ( $item.find('.item-description .hidden-word').length ) {
      var more = $('<a href="#" class="more">more</a>');

      more.on('click', function () {

        if ( $(this).hasClass('more') ) {
          $(this).removeClass('more').addClass('less').text('less');
          $(this).closest('.item-description').find('.hidden-word').show();
        }

        else {
          $(this).removeClass('less').addClass('more').text('more');
          $(this).closest('.item-description').find('.hidden-word').hide();
        }

        return false;

      });
    }

    $item.find('.item-description').append(more);
  }

  module.exports = readMore;

} ();

},{}],27:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  S   I   G   N

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav = require('./Nav');

  function Sign () {
    
  }

  Sign.dialog = {

    login: function () {

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      var content = $($('#login-modal').html());

      vex.dialog.confirm({

        afterOpen: function () {
          $('.login-button')
            .off('click')
            .on('click', function () {
              vex.close();
            });
        },

        afterClose: function () {
          $('.login-button').on('click', Sign.dialog.login);
        },

        message: $('#login-modal').html(),
        buttons: [
           //- $.extend({}, vex.dialog.buttons.YES, {
           //-    text: 'Login'
           //-  }),

           $.extend({}, vex.dialog.buttons.NO, {
              text: 'x Close'
            })
        ],
        callback: function(value) {
          return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
        },
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    },

    join: function () {

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function () {
          $('.join-button')
            .off('click')
            .on('click', function () {
              vex.close();
            });
        },

        afterClose: function () {
          $('.join-button').on('click', Sign.dialog.join);
        },

        message: $('#join').html(),
        buttons: [
           //- $.extend({}, vex.dialog.buttons.YES, {
           //-    text: 'Login'
           //-  }),

           $.extend({}, vex.dialog.buttons.NO, {
              text: 'x Close'
            })
        ],
        callback: function(value) {
          return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
        },
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    }

  };

  Sign.prototype.render = function () {
    this.signIn();
    this.signUp();
    this.forgotPassword();

    app.socket.on('online users', function (online) {
      $('.online-users').text(online);
    });

    if ( ! synapp.user ) {
      $('.login-button').on('click', Sign.dialog.login);
      $('.join-button').on('click', Sign.dialog.join);
    }

    else {
      $('.topbar .is-out').remove();
    }
  };

  Sign.prototype.signIn = require('./Sign/sign-in');

  Sign.prototype.signUp = function () {

    $('#join').find('.i-agree').on('click', function () {
      var agreed = $('#join').find('.agreed');

      if ( agreed.hasClass('fa-square-o') ) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      }
      else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });

    $('#join').find('form').on('submit', function () {
      
      var email = $(this).find('[name="email"]');
      var password = $(this).find('[name="password"]');
      var confirm = $(this).find('[name="confirm"]');

      email.removeClass('error');
      password.removeClass('error');
      confirm.removeClass('error');

      $('#join').find('.alert')
          .css('display', 'none');

      if ( ! email.val() ) {
        email.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Please enter an email address');
      }

      else if ( ! password.val() ) {
        password.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Please enter a password');
      }

      else if ( ! confirm.val() ) {
        confirm.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Please confirm password');
      }

      else if ( password.val() !== confirm.val() ) {
        confirm.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Passwords do not match');
      }

      else {
        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: email.val(),
            password: password.val()
          }
        })
          
          .error(function (response, state, code) {
            if ( response.status === 401 ) {
              $('#join').find('.alert')
                .css('display', 'block')
                .find('.alert-message').text('This email address is already in use');
            }
          })
          
          .success(function (response) {
            synapp.user = response.user;
            
            $('.is-in').css('display', 'block');

            $('#join').modal('hide');

            $('#signer').find('section').hide(2000);

            $('#signer').find('.sign-success')
              .show(function () {
                setTimeout(function () {
                  $('#signer').hide(2500);
                }, 5000);
              })
              .text('Welcome to Synaccord!');
          });
      }

      return false;
    })
  };

  Sign.prototype.forgotPassword = require('./Sign/forgot-password');

  module.exports = Sign;

} ();

},{"./Nav":17,"./Sign/forgot-password":28,"./Sign/sign-in":29}],28:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function forgotPassword () {

    var signComponent = this;

    this.form = $('#forgot-password form');

    // On close modal, reset form

    $('#forgot-password .close').on('click', function () {

      signComponent.form.find('[name="email"]').val('').removeClass('error');

      if ( $('.forgot-password-email-not-found.in').length ) {
        $('.forgot-password-email-not-found').collapse('hide');
      }

      if ( $('.forgot-password-pending.in').length ) {
        $('.forgot-password-pending').collapse('hide');
      }

      if ( $('.forgot-password-ok.in').length ) {
        $('.forgot-password-ok').collapse('hide');
      }

    });


    $('#forgot-password form[name="forgot-password"]').on('submit', function () {

      // If previous operation still in course, abort

      if ( $('.forgot-password-pending.in').length ) {
        return false;
      }

      // If previous operation OK, abort

      if ( $('.forgot-password-ok.in').length ) {
        return false;
      }
    
      var email = $(this).find('[name="email"]');

      email.removeClass('error');

      if ( $('.forgot-password-email-not-found.in').length ) {
        $('.forgot-password-email-not-found').collapse('hide');
      }

      if ( ! email.val() ) {
        email.addClass('error').focus();
      }

      else {

        $('.forgot-password-pending').collapse('show');

        setTimeout(function () {
          app.socket.once('no such email', function (_email) {
            if ( _email === email.val() ) {

              $('.forgot-password-pending').css('display', 'none');

              $('.forgot-password-pending').collapse('hide');

              setTimeout(function () {
                $('.forgot-password-pending').css('display', 'block');
              });

              $('.forgot-password-email-not-found').collapse('show');
            }
          });

          app.socket.on('password is resettable', function (_email) {
            if ( _email === email.val() ) {
              $('.forgot-password-pending').collapse('hide');

              $('.forgot-password-ok').collapse('show');

              $('.form-section.collapse').collapse('hide');

              setTimeout(function () {
                $('#forgot-password').modal('hide');
              }, 2500);
            }
          });

          app.socket.emit('send password', email.val());
        }, 750);

      }

      return false;
    });
  
  }

  module.exports = forgotPassword;

} ();

},{}],29:[function(require,module,exports){
! function () {
  
  'use strict';

  var Form = require('../Form');

  /**
   *  @method Sign.signIn
   *  @return
   *  @arg
   */

  function signIn () {
    
    var signForm = $('.vex-content');

    console.log('sign in form', signForm.length);

    new Form(signForm)

      .send(function () {
        console.log('hahaha')
      });

    // signForm.on('submit', function () {

    //   var domain = require('domain').create();
      
    //   domain.on('error', function (error) {
    //     throw error;
    //   });
      
    //   domain.run(function () {
    //     // ... code
    //   });

    //   return false;

    //   Nav.hide($('.login-error-401'));
    //   Nav.hide($('.login-error-404'));

    //   signForm.find('.sign-error')
    //     .text('')
    //     .hide();

    //   var email = signForm.find('[name="email"]');
    //   var password = signForm.find('[name="password"]');

    //   email.removeClass('error');
    //   password.removeClass('error');

    //   if ( ! email.val() ) {
    //     email.addClass('error');
    //     email.focus();
    //   }

    //   else if ( ! password.val() ) {
    //     password.addClass('error');
    //     password.focus();
    //   }

    //   else {
    //     $.ajax({
    //       url: '/sign/in',
    //       type: 'POST',
    //       data: {
    //         email: email.val(),
    //         password: password.val()
    //       }
    //     })
    //       .error(function (response) {
    //         switch ( response.status ) {
    //           case 404:
    //             Nav.show($('.login-error-404'));
    //             break;

    //           case 401:
    //             Nav.show($('.login-error-401'));
    //             break;
    //         }
    //       })
    //       .success(function (response) {

    //         synapp.user = response.user;

    //         $('a.is-in').css('display', 'inline');

    //         $('.navbar .is-out').remove();

    //         $('#login-modal').modal('hide');

    //         signForm.find('section').hide(2000);

    //       });
    //   }

    //   return false;
    // });
  }

  module.exports = signIn;

} ();

},{"../Form":9}],30:[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Stream (file) {

    var stream = ss.createStream();

    // stream.end = function (cb) {
    //   this.on('end', cb);

    //   return this;
    // };

    // stream.error = function (cb) {
    //   this.on('error', cb);

    //   return this;
    // };

    ss(app.socket).emit('upload image', stream,
      { size: file.size, name: file.name });
    
    ss.createBlobReadStream(file).pipe(stream);

    return stream;
  }

  module.exports = Stream;

} ();

},{}],31:[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  S   Y   N   A   P   P

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Panel     =   require('./Panel');
  var Sign      =   require('./Sign');
  var Intro     =   require('./Intro');
  var domain    =   require('domain');

  /**
   *  @class Synapp
   *  @extends EventEmitter
   */

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

    this.socket.once('connect', function () {
      self.emit('connect');
    });

    this.socket.on('error', function (error) {
      console.log('socket error', error);
    });

    this.evaluations = [];

    this.cache = {
      template: {
        item: null
      }
    };

    if ( synapp.user ) {
      $('.is-in').removeClass('is-in');
    }
  }

  require('util').inherits(Synapp, require('events').EventEmitter);

  /**
   *  @method connect
   *  @description Sugar to register a listener to the "connect" event
   *  @arg {function} fn
   */

  Synapp.prototype.connect = function (fn) {
    this.on('connect', fn);

    return this;
  };

  /**
   *  @method topLevelPanel
   *  @description Insert a new top-level panel
   *  @arg {function} cb
   */

  Synapp.prototype.topLevelPanel = function (cb) {
    var self = this;

    var panel = new Panel('Topic');

    panel
      
      .get(self.domain.intercept(function (template) {

        $('.panels').append(template);

        setTimeout(function () {
          panel.render(self.domain.intercept(function () {
            panel.fill(cb);
          }));
        }, 700);
      }));
  };

  // Export

  if ( module && module.exports ) {
    module.exports = Synapp;
  }

  if ( typeof window === 'object' ) {
    window.Synapp = Synapp;
  }

} ();

},{"./Intro":10,"./Panel":18,"./Sign":27,"domain":36,"events":37,"util":41}],32:[function(require,module,exports){
; ! function () {

  'use strict';

  var Nav = require('./Nav');

  function Truncate (item) {

    // ============

    this.item = item;

    this.description = this.item.find('.description:first');

    this.textWrapper = this.item.find('.item-text:first');

    this.reference = this.item.find('.reference:first');

    this.text = this.description.text();

    this.words = this.text.split(' ');

    this.height = parseInt(this.textWrapper.css('paddingBottom'));

    this.truncated = false;

    this.moreLabel = 'more';

    this.lessLabel = 'less';

    this.isIntro = ( this.item.attr('id') === 'intro' );

    if ( ! this.isIntro ) {
      this._id = this.item.attr('id').split('-')[1];
    }

    // ============

    this.tagify();

    if ( this.truncated ) {
      item.addClass('is-truncated');
      this.appendMoreButton();
    }
  }

  Truncate.prototype.tagify = function () {

    var self = this;

    this.description.empty();

    this.reference.hide();

    var i = 0;

    this.words.forEach(function (word, index) {

      var span = $('<span class="word"></span>');

      if ( self.truncated ) {
        span.addClass('truncated');
        span.hide();
      }

      span.text(word + ' ');

      self.description.append(span);

      if ( i === 5 ) {

        var diff = self.textWrapper.height() > self.height;

        if ( diff && ! self.truncated && (index !== (self.words.length - 1)) ) {

          self.truncated = true;
        }

        i = -1;
      }

      i ++;
    });
  };

  Truncate.prototype.appendMoreButton = function () {

    var self = this;

    // create more button

    this.more = $('<span class="truncator"><i>... </i>[<a href=""></a>]</span>');

    // more button's text

    this.more.find('a').text(self.moreLabel);

    // more button's on click behavior

    this.more.find('a').on('click', function () {

      var moreLink = $(this);

      // Exit if already an animation in progress

      if ( self.item.find('.is-showing').length ) {
        return false;
      }

      Nav.scroll(self.item, function () {

        // Show more

        if ( moreLink.text() === self.moreLabel ) {
          
          // If is intro

          if ( self.isIntro ) {
            self.unTruncate();
            moreLink.closest('span').find('.reference').show();
            moreLink.text(self.lessLabel);
            moreLink.closest('span').find('i').hide();
          }
          
          else {
            // If there is already stuff shown, hide it first

            if ( self.item.find('.is-shown').length ) {
              
              // Trigger the toggle view to hide current shown items

              $rootScope.publish("toggle view",
                { view: "text", item: self._id });

              // Listen on hiding done

              $rootScope.subscribe('did hide view', function (options) {

                // Make sure it concerns our item

                if ( options.item === self._id )  {

                  // untruncate

                  setTimeout(function () {
                    self.unTruncate();
                  });
                }
              });
            }

            else {
              self.unTruncate();
              moreLink.closest('span').find('.reference').show();
              moreLink.text(self.lessLabel);
              moreLink.closest('span').find('i').hide();
            }
          }
        }

        // hide

        else {
          self.reTruncate();
          moreLink.closest('span').find('.reference').hide();
          moreLink.text(self.moreLabel);
          moreLink.closest('span').find('i').show();
        }
      });

      return false;
    });

    this.description.append(this.more);
  };

  Truncate.prototype.unTruncate = function () {
      
    var self = this;

    var interval = 0;

    var inc = 50;

    // var inc = Math.ceil(self.height / self.words.length);

    // show words 50 by 50

    for ( var i = 0; i < this.words.length ; i += inc ) {
      setTimeout(function () {
        var k = this.i + inc;
        for ( var j = this.i; j < k ; j ++ ) {
          self.item.find('.truncated:eq(' + j + ')').show();
        }
      }.bind({ i: i }), interval += (inc * 1.5));
    }

    // on done showing words, wrap up
  };

  Truncate.prototype.reTruncate = function () {
    
    var self = this;

    var interval = 0;

    var inc = Math.ceil(self.height / self.words.length);

    for ( var i = 0; i < this.words.length ; i += inc ) {
      setTimeout(function () {
        var k = this.i + inc;
        for ( var j = this.i; j < k ; j ++ ) {
          self.item.find('.truncated:eq(' + j + ')').hide();
        }
      }.bind({ i: i }), interval += (inc * 2));
    }
  };

  module.exports = Truncate;  

}();

},{"./Nav":17}],33:[function(require,module,exports){
! function () {

  'use strict';

  function Upload (dropzone, file_input, thumbnail, cb) {
    this.dropzone = dropzone;
    this.file_input = file_input;
    this.thumbnail = thumbnail;
    this.cb = cb;


    this.init();
  }

  Upload.prototype.init = function () {

    if ( window.File ) {
      if ( this.dropzone ) {
        this.dropzone
          .on('dragover',   this.hover.bind(this))
          .on('dragleave',  this.hover.bind(this))
          .on('drop',       this.handler.bind(this));
      }

      if ( this.file_input ) {
        this.file_input.on('change', this.handler.bind(this));
      }
    }

    else {
      if ( dropzone ) {
        dropzone.find('.modern').hide();
      }
    }
  };

  Upload.prototype.hover = function (e) {
    e.stopPropagation();
    e.preventDefault();
  };

  Upload.prototype.handler = function (e) {
    this.hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      this.preview(f, e.target);
    }
  };

  Upload.prototype.preview = function(file, target) {
    var upload = this;

    var img = new Image();

    img.classList.add("img-responsive");
    img.classList.add("preview-image");
    
    img.addEventListener('load', function () {

      $(img).data('file', file);

      upload.thumbnail.empty().append(img);

    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    if ( this.cb ) {
      this.cb(null, file);
    }
  };

  module.exports = Upload;

} ();

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
! function () {
  
  'use strict';

  var Synapp    =   require('../Synapp');
  var Sign      =   require('../Sign');
  var Intro     =   require('../Intro');
  var Panel     =   require('../Panel');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();
    new Intro().render();

    var panel = new Panel('Topic');

    panel
      
      .get(app.domain.intercept(function (template) {

        $('.panels').append(template);

        setTimeout(function () {
          panel.render(app.domain.intercept(function () {
            panel.fill();
          }));
        }, 700);

      }));
  });

} ();

},{"../Intro":10,"../Panel":18,"../Sign":27,"../Synapp":31}],36:[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events')

	// Export Domain
	var domain = {}
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter()

		function emitError(e) {
			d.emit('error', e)
		}

		d.add = function(emitter){
			emitter.on('error', emitError)
		}
		d.remove = function(emitter){
			emitter.removeListener('error', emitError)
		}
		d.bind = function(fn){
			return function(){
				var args = Array.prototype.slice.call(arguments)
				try {
					fn.apply(null, args)
				}
				catch (err){
					emitError(err)
				}
			}
		}
		d.intercept = function(fn){
			return function(err){
				if ( err ) {
					emitError(err)
				}
				else {
					var args = Array.prototype.slice.call(arguments, 1)
					try {
						fn.apply(null, args)
					}
					catch (err){
						emitError(err)
					}
				}
			}
		}
		d.run = function(fn){
			try {
				fn()
			}
			catch (err) {
				emitError(err)
			}
			return this
		};
		d.dispose = function(){
			this.removeAllListeners()
			return this
		};
		d.enter = d.exit = function(){
			return this
		}
		return d
	};
	return domain
}).call(this)
},{"events":37}],37:[function(require,module,exports){
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
      }
      throw TypeError('Uncaught, unspecified "error" event.');
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

},{}],38:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],39:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
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
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],40:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],41:[function(require,module,exports){
(function (process,global){
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":40,"_process":39,"inherits":38}]},{},[35]);
