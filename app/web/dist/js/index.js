(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
  *
  *     ********    ***  ***        ***              ***  ´********
  *     ***    ***  ***   ***      ***               ***  * 
  *     ***    ***  ***    ***    ***                ***  `*******`
  *     ***   ***   ***     ***  ***     ***  ***    ***          *
  *     ********    ***      ******      ***   ********   ********´
  *
 **/

! function () {

  'use strict';

  /** Div
   *
   *  @class
   *  @extends EventEmitter
   */

  function Div () {

    var div           =   this;

    this.models       =   {};

    this.emitters     =   {};

    this.controllers  =   {};

    this.extensions   =   {};

    this.watch        =   new (require('events').EventEmitter)();

    this.domain       =   require('domain').create();

    this.domain.on('error', function (error) {
      div.emit('error', error);
    });

    this.domain.intercept = function (fn, self) {

      if ( typeof fn !== 'function' ) {
        fn = function () {};
      }

      return function (error) {
        if ( error && error instanceof error ) {
          div.domain.emit('error', error);
        }

        else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(self, args);
        }
      };

    };
  }

  require('util').inherits(Div, require('events').EventEmitter);

  /**
   *  @method
   *  @return Div
   *  @arg {String|Object} name
   *  @arg {Mixed?} model
   */

  Div.prototype.model       =   function (name, model) {
    var div = this;

    if ( ! name ) {
      return this;
    }

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        div.model(i, name[i]);
      }

      return div;
    }

    if ( typeof name === 'string' ) {


      if ( '1' in arguments ) {
        
        if ( name in this.models ) {
          this.watch.emit('update ' + name, model, this.models[name]);
          this.models[name] = model;
        }

        else {
          this.models[name] = model;
          this.watch.emit('add ' + name, model);
        }

        return div;
      }

      return this.models[name];
    }
  };

  /**
   *  @method
   *  @return Div
   *  @arg {String|Object} name
   *  @arg {Mixed?} controller
   */

  Div.prototype.controller  =   function (name, controller) {
    var div = this;

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.controller(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.controllers[name] = controller.bind(this);

        // this.controllers[name].attach = function () {
        //   div.controllers[name].call(div, arguments);
        // };

        return this;
      }

      return this.controllers[name];
    }
  };

  /**
   *  @method
   *  @return Div
   *  @arg {String|Object} name
   *  @arg {Mixed?} emitter
   */

  Div.prototype.emitter     =   function (name, emitter) {
    var div = this;


    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.emitter(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.emitters[name] = emitter;

        return this;
      }

      return this.emitters[name];
    }
  };

  /**
   *  @method
   *  @return Div
   *  @arg {String|Object} name
   *  @arg {Function} binder
   */

  Div.prototype.bind        =   function(model, binder) {

    var div = this;

    this.watch.on('add ' + (model.model || model), function (_new, _old) {
      binder(_new, _old, 'add');
    });

    this.watch.on('update ' + (model.model || model), function (_new, _old) {
      binder(_new, _old, 'update');
    });

    this.watch.on('delete ' + (model.model || model), function (_new, _old) {
      binder(_new, _old, 'delete');
    });

    return this;
  };

  /**
   *  @method
   *  @return Div
   *  @arg {String|Object} name
   *  @arg {Mixed?} extension
   */

  Div.prototype.extension   =   function (name, extension) {
    var div = this;

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.extension(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.extensions[name]           =   Div.factory(extension);
        this.extensions[name].root      =   this;

        return this;
      }

      return this.extensions[name];
    }
  };

  /**
   *  @method
   *  @return Div
   *  @arg {Function} fn
   */

  Div.prototype.run         =   function (fn) {

    var div = this;
    
    if ( typeof fn === 'function' ) {
      setTimeout(function () {
        
        div.domain.run(function () {
          fn.apply(this);
        });

      });
    }

    return this;
  };

  /**
   *  @method
   *  @return Div
   *  @arg {String} model
   *  @arg {Mixed} item
   */

  Div.prototype.push        =   function (model, item) {

    var div = this;

    if ( Array.isArray(this.models[model]) ) {
      setTimeout(function () {
        div.model(model, div.models[model].concat([item]));
        div.watch.emit('push ' + model, item);
      });
    }

    return this;
  };

  /**
   *  @method
   *  @return Div
   *  @arg {String} model
   *  @arg {Number?} step
   */

  Div.prototype.inc         =   function (model, step) {

    if ( typeof step === 'undefined' ) {
      step = 1;
    }

    this.model(model, this.model(model) + step);

    return this;
  };

  /**
   *  @method
   *  @return Div
   *  @arg {Object} ext
   */

  Div.factory               =   function (ext) {

    var div = new Div()

      .extension(ext.extensions || {})

      .emitter(ext.emitters || {})

      .model(ext.models || {})

      .controller(ext.controllers || {});
    ;

    if ( ext.run ) {
      div.run = ext.run;
    }

    if ( ext.on ) {
      for ( var event in ext.on ) {
        div.on(event, ext.on[event].bind(div));
      }
    }

    return div;
  };

  // export

  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = Div;
  }

  // window
  
  else if ( typeof window !== 'undefined' ) {
    window.Div = Div;
  }

} ();

},{"domain":45,"events":46,"util":50}],2:[function(require,module,exports){
/**
 *  @author https://github.com/co2-git
 *  @licence MIT
 */

! function (context) {

  'use strict';

  /** luigi - minimalistic template rendere
   *
   *  @function
   *  @return null
   *  @arg {String|Object} id
   */

  function Luigi (id) {

    var luigi = this;

    luigi.id = id;

    setTimeout(function () {
      luigi.render();
    });
  }

  require('util').inherits(Luigi, require('events').EventEmitter);

  Luigi.prototype.render = function () {
    var luigi = this;

    // Make sure we have jQuery

    if ( typeof $ !== 'function' ) {
      return luigi.emit('error', Luigi.Error.Missing_Dependency('jQuery'));
    }

    // Get script template by id

    var template;

    if ( typeof luigi.id === 'string' ) {
      template = $('#' + luigi.id);
    }

    else {
      template = luigi.id;
    }

    // Complain if no script template found by that id 

    if ( ! template.length ) {
      return luigi.emit('error',
        Luigi.Error.No_Such_Template(template, luigi.id));
    }

    // If not a script, just pass the view then

    var elem = template[0].nodeName.toLowerCase();

    if ( elem === 'script' ) {
      // Get src attribute

      var src = template.attr('src');

      // If has src, hence URL

      if ( src ) {

        // Fetch url

        return $.ajax(src)

          // Rejoyce on success

          .success(function (data) {
            luigi.emit('view', $(data));
          })

          // Complain on error

          .error(function (error) {
            luigi.emit('error', error);
          });
      }

      // No src attribute, so it is static template

      luigi.emit('view', $(template.text().trim()));
    }

    else {
      luigi.emit('view', template);
    }
  };

  Luigi.prototype.controller = function (controller) {
    this.on('view', controller);

    return this;
  };

  Luigi.Error = {};

  Luigi.Error.Missing_Dependency = function (dep) {
    var error = new Error('Luigi Dependency Error! Missing: ' + dep);
    error.code = 'MISSING_DEPENDENCY';
    error.dep = dep;
    return error;
  };

  Luigi.Error.No_Such_Template = function (template, id) {

    var tpl = typeof id === 'string' ? id : id.selector;

    var error = new Error('Luigi Error! No such template: ' + tpl);
    error.code = 'NO_SUCH_TEMPLATE';
    error.tpl = tpl;
    return error;
  };

  function luigi (id) {
    return new Luigi(id);
  }

  // export

  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = luigi;
  }

  // window
  
  else if ( typeof window !== 'undefined' ) {
    window.luigi = luigi;
  }

} (this);

},{"events":46,"util":50}],3:[function(require,module,exports){
! function () {

	'use strict';

	function getIntro () {
    var div = this;

    var Socket = div.root.emitter('socket');

    var Panel = div.root.extension('Panel');
    if ( ! div.model('intro') ) {

      Socket.emit('get intro');

      Socket.once('got intro', function (intro) {
        div.model('intro', intro);
      });

      div.bind('intro', function (intro) {

        luigi('intro')

          .controller(function (view) {
            var Item = div.root.extension('Item');

            view.find('.panel-title').text(intro.subject);
            view.find('.item-title').text(intro.subject);
            view.find('.description').eq(0).text(intro.description);

            luigi('tpl-responsive-image')

              .controller(function (img) {
                img.attr('src', intro.image);

                view.find('.item-media').empty().append(img);
              });

            view.find('.item-references').hide();

            new (Item.controller('truncate'))(view);

            view.find('.promoted').hide();

            view.find('.box-buttons').hide();

            view.find('.toggle-arrow').hide();
          });

      });
    }
  }

  module.exports = getIntro;

} ();

},{}],4:[function(require,module,exports){
/**
                                                        
            dP            dP                     
                          88                     
            88 88d888b. d8888P 88d888b. .d8888b. 
            88 88'  `88   88   88'  `88 88'  `88 
            88 88    88   88   88       88.  .88 
            dP dP    dP   dP   dP       `88888P'                                  

*/

! function () {

  'use strict';

  module.exports = {
    models: {
      intro: null
    },

    controllers: {
      'get intro': require('./controllers/get-intro')
    },

    run: function () {

      var div = this;

      div.root.model('socket_conn')
        ?   div.controller('get intro')()
        :   div.root.emitter('socket').once('connect', div.controller('get intro'));

    }
  };

} ();

},{"./controllers/get-intro":3}],5:[function(require,module,exports){
! function () {

  'use strict';

  function createItem ($panel) {
    var div = this;

    var Socket = div.root.emitter('socket');

    Socket.on('created item', function (item) {

      console.info('beat dump')

      item.is_new = true;
      
      div.push('items', item);

      div.controller('render')(item, div.domain.intercept());
    });
  }

  module.exports = createItem;

} ();

},{}],6:[function(require,module,exports){
! function () {

  'use strict';

  function detailsVotes (details, criteria) {

    return function luigiController (view) {
      setTimeout(function () {

        view.find('h4').text(criteria.name);

        var vote = details.votes[criteria._id];

        var svg = $('<svg class="chart"></svg>');

        svg.attr('id', 'chart-' + details.item._id + '-' + criteria._id);

        view.find('.chart').append(svg);

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
      }, 800);
    };
  }

  module.exports = detailsVotes;

} ();

},{}],7:[function(require,module,exports){
! function () {

  'use strict';

  function editAndGoAgain (view, item) {

    var app = this;

    console.log('%c Rendering Edit and go again', 'font-weight:bold', item);

    var $item = view.find('.item');

    console.log($item.length)

    $item.find('[name="subject"]').val(item.subject);
    $item.find('[name="description"]').val(item.description);

    if ( item.references.length ) {
      $item.find('[name="reference"]').val(item.references[0].url);
    }

    $item.find('.item-media-wrapper')
      .empty()
      .append(
        this.controller('item media')(item));

    $item.find('.button-create').on('click', function () {

      var $editor      =   $(this).closest('.editor');

      // Subject field

      var $subject      =   $editor.find('[name="subject"]');

      // Description field

      var $description  =   $editor.find('[name="description"]');

      // Reference field
      
      var $reference    =   $editor.find('[name="reference"]');

      // Reset errors in case of any from previous call

      $subject.removeClass('error');

      $description.removeClass('error');

      // Subject empty? Trigger visual error

      if ( ! $subject.val() ) {
        $subject.addClass('error').focus();
      }

      // Description empty? Trigger visual error

      else if ( ! $description.val() ) {
        $description.addClass('error').focus();
      }

      // No Errors? Proceed to back-end transmission

      else {
        var _item = item;

        _item.from = item._id;
        _item.subject = $subject.val();
        _item.description = $description.val();
        _item.references = [{
          url: $reference.val()
        }];

        delete _item._id;

        app.importer.emitter('socket').emit('edit and go again', _item,
          function (error, new_item) {
            if ( error ) {

            }
            else {
              new_item.is_new = true;

              app.importer.extension('Panel').controller('hide')(
                $editor, function () {
                  app.push('items', new_item);
                });
            }
          });
      }
    });

  };

  module.exports = editAndGoAgain;

} ();

},{}],8:[function(require,module,exports){
/** Item/Expand
 *
 *  Expands an item's subpanel
 */


! function () {
  
  'use strict';

  /**
   *  @function expand
   *  @arg {Object} item
   *  @arg {Object} $panel
   *  @arg {Object} $item
   *  @arg {Object} $children
   *  @arg {Object} $toggleArrow
  */

  function expand (item, $panel, $item, $children, $toggleArrow) {

    var div     =   this;
    var Panel   =   div.root.extension('Panel');

    console.log('%c Expanding item', 'font-weight:bold', item);

    function panel () {
      return {
        type: children,
        parent: item._id,
        size: synapp['navigator batch size'],
        skip: 0
      };
    };

    // Stuff to hide

    var hide = [];

    [
      $panel.find('>.panel-body >.creator.is-shown'),
      $item.find(' >.collapsers >.evaluator.is-shown'),
      $item.find(' >.collapsers >.details.is-shown')
    ]
    .forEach(function (e) {
      if ( e.length ) {
        hide.push(function (cb) {
          Panel.controller('hide')(e, cb);
        });
      }
    });

    hide.push(function (cb) {
      // Is loaded so just show  
      
      if ( $children.hasClass('is-loaded') ) {
        Panel.controller('reveal')($children, $item);

        $toggleArrow
          .find('i.fa')
          .removeClass('fa-arrow-down')
          .addClass('fa-arrow-up');
      }

      // else load and show
      
      else {

        Panel.controller('reveal')($children, $item, function () {
          $children.addClass('is-loaded');

          setTimeout(function () {
            $toggleArrow.find('i.fa')
              .removeClass('fa-arrow-down')
              .addClass('fa-arrow-up');
            });

          var children = synapp['item relation'][item.type];

          if ( typeof children === 'string' ) {
            Panel.controller('make')(children, item._id)
              .controller(function (view) {
                $children.find('.is-section').append(view);

                Panel.push('panels', {
                  type: children,
                  parent: item._id,
                  size: synapp['navigator batch size'],
                  skip: 0
                });
              });
          }

          else if ( Array.isArray(children) ) {
            children.forEach(function (child) {

              if ( typeof child === 'string' ) {
                Panel.push('panels', panel());
              }

              else if ( Array.isArray(child) ) {
                child.forEach(function (c) {

                  var p = panel();
                  p.split = true;

                  Panel.push('panels', p);
                });
              }

            });
          }
        });
      }

      cb();
    });

    require('async').series(hide, div.domain.intercept(function () {

    }));
  }

  module.exports =  expand;

}();

},{"async":44}],9:[function(require,module,exports){
! function () {

  'use strict';

  function getItemDetails ($details, item) {
    var div = this;

    var Socket = div.root.emitter('socket');

    $details.addClass('is-loaded');

    Socket.emit('get item details', item);

    Socket.once('got item details', function (details) {

      console.warn('got details', details)

      details.criterias.forEach(function (criteria, index) {
        luigi('tpl-details-votes')
          .controller(div.controller('details votes')(details, criteria))
          .controller(function ($votes) {
            $details.find('.votes-by-criteria').append($votes);
          });
      });

      if ( details.feedbacks.length ) {
        details.feedbacks.forEach(function (feedback) {
          luigi('tpl-details-feedback')
            .controller(function ($feedback) {
              $feedback.find('.feedback .pre-text').text(feedback.feedback);
              
              $details.find('.feedback-list').append($feedback);
            });
          // app.render('details feedback', feedback,
          //   function (feedbackView) {
          //     feedbackView.removeClass('template-model');
          //     $details.find('.details-feedbacks').append(feedbackView);
          //   });
        });
      }

      else {
        $details.find('.details-feedbacks h4').css('display', 'none');
      }
    });
  }

  module.exports = getItemDetails;

} ();

},{}],10:[function(require,module,exports){
! function () {

  'use strict';

  function getItems () {
    var div       =   this;
    var Socket    =   div.root.emitter('socket');
    var Panel     =   div.root.extension('Panel');

    // On new panel, get panel items from socket

    Panel.watch.on('panel view rendered', function (panel) {
      console.log('%c panel view rendered', 'font-weight: bold; color: magenta', panel);
      Socket.emit('get items', panel);
    });

    // On items from socket

    Socket.on('got items', function (panelView) {

      console.log('%c got items', 'font-weight: bold; color: magenta', panelView);

      var panel = panelView.panel;
      var items = panelView.items;

      items.forEach(function (item) {
        div.push('items', item);
      });

      div.watch.once('panel model updated', function (panel) {

        console.log('%c panel model updated', 'font-weight: bold; color: magenta', panel);

        if ( items.length ) {

          div.watch.once('panel view updated', function () {
            console.log('%c panel view updated', 'font-weight: bold; color: magenta', panel);

            require('async').series(items

              .filter(function (item, i) {
                return i < synapp['navigator batch size'];
              })

              .map(function (item, i) {

                return function (cb) {
                  div.controller('render')(item, cb);
                };
              }),
              

              div.domain.intercept(function (results) {
                var panelId = '#panel-' + panel.type;

                if ( panel.parent ) {
                  panelId += '-' + panel.parent;
                }

                var $panel  =   $(panelId);

                $panel.removeClass('is-filling')

                // Show/Hide load-more

                if ( items.length === synapp['navigator batch size'] ) {
                  $(panelId).find('.load-more').show();
                }
                else {
                  $(panelId).find('.load-more').hide();
                }
              }));
          });
          
        }

        setTimeout(function () {
          div.controller('update panel view')(panel, items);
        });

      });

      div.controller('update panel model')(panel, items);
    });
  }

  module.exports = getItems;

} ();

},{"async":44}],11:[function(require,module,exports){
! function () {

  'use strict';

  function invitePeopleIn ($details, item) {
     var link = window.location.protocol + '//' + window.location.hostname +
      '/item/' + item._id + '/' + require('string')(item.subject).slugify();

    $details.find('.invite-people-body').attr('placeholder',
      $details.find('.invite-people-body').attr('placeholder') +
      link);

    $details.find('.invite-people').attr('href',
      'mailto:?subject=' + item.subject + '&body=' +
      ($details.find('.invite-people-body').val() ||
      $details.find('.invite-people-body').attr('placeholder')) +
      "%0A%0A" + ' Synaccord - ' + link);
  }

  module.exports = invitePeopleIn;

} ();

},{"string":51}],12:[function(require,module,exports){
; ! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function itemMedia (item) {

    var div = this;

    // youtube video from references

    if ( item.references.length ) {
      var media = div.controller('youtube')(item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( item.image ) {

      var src = item.image;

      if ( ! /^http/.test(item.image) ) {
        src = synapp['default item image'];
      }

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

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

},{"/home/francois/Dev/luigi/luigi":2}],13:[function(require,module,exports){
! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function placeItemInPanel (item, view, cb) {

    var div = this;
    var Panel = div.root.extension('Panel');

    var panelId = '#panel-' + item.type;

    if ( item.parent ) {
      panelId += '-' + item.parent;
    }

    console.warn('placing 2', item.subject, panelId);

    // In case of a new item
    
    if ( item.is_new ) {
      $(panelId).find('.items').prepend(view);

      // image if any

      var file = $('.creator.' + item.type)
        .find('.preview-image').data('file');

      if ( file ) {
        view.find('.item-media img').attr('src',
          (window.URL || window.webkitURL).createObjectURL(file));
      }

      setTimeout(function () {
        // call promote

        view.find('.toggle-promote').click();
      });
    }
    
    // Else, regular fetch

    else {
      $(panelId).find('> .panel-body > .items').append(view);
    }

    luigi('tpl-toggle-arrow')
      
      .controller(function (arrow) {
        arrow.insertAfter(view);

        cb();
      });
  }

  module.exports = placeItemInPanel;

} ();

},{"/home/francois/Dev/luigi/luigi":2}],14:[function(require,module,exports){
! function () {

  'use strict';

  function progressBar ($details, item) {
    // promoted bar

    $details.find('.progress-bar')
      .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
      .text(Math.floor(item.promotions * 100 / item.views) + '%');
  }

  module.exports = progressBar;

} ();

},{}],15:[function(require,module,exports){
! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function render (item, cb) {

    var div       =   this;
    var Panel     =   div.root.extension('Panel');
    var Promote   =   div.root.extension('Promote');
    var Socket    =   div.root.emitter('socket');

    var id = 'item-' + item._id;

    if ( item.is_new ) {
      var panel = 'panel-' + item.type;

      if ( item.parent ) {
        panel += '-' + item.parent;
      }

      id = $('#' + panel + ' >.panel-body >.items >.is-new');
    }

    console.log('id', id, item.subject);

    if ( ( typeof id === 'string' && ! $('#' + id).length ) || ( typeof
       id === 'object' && ! id.length ) ) {
      console.log('Item view not found', item.subject);
      return cb();
    }

    luigi(id)

      .on('error', function (error) {
        div.emit('error', error);
      })
      
      .controller(function (view) {

        cb(null, item, view);

        setTimeout(function () {
          console.log('rendering item', item.subject)

          // DOM Elements

          var $collapsers     =   view.find('>.collapsers');
          var $toggleArrow    =   view.find('>.toggle-arrow');
          var $subject        =   view.find('>.item-text > h4.item-title a');
          var $description    =   view.find('>.item-text >.description');
          var $references     =   view.find('>.item-text >.item-references');
          var $itemMedia      =   view.find('>.item-media-wrapper >.item-media');
          var $togglePromote  =   view.find('>.box-buttons .toggle-promote');
          var $promoted       =   view.find('>.box-buttons .promoted');
          var $promotedPercent=   view.find('>.box-buttons .promoted-percent');
          var $toggleDetails  =   view.find('>.box-buttons .toggle-details');

          // Static link

          var staticLink    =   '/item/' + item._id + '/' + require('string')(item.subject).slugify();

          // Assign item id

          view.attr('id', 'item-' + item._id);

          // Subject

          $subject
            .attr('href', staticLink)
            .text(item.subject);

          // Description
        
          $description
            .text(item.description);

          // References

          if ( item.references.length ) {
            $references.show();

            $references.find('a')
              .attr('href', item.references[0].url)
              .text(item.references[0].title || item.references[0].url);
          }
          else {
            $references.hide();
          }

          // Item media

          if ( ! item.is_new ) {
            $itemMedia.empty().append(
              div.controller('item media')(item));
          }

          if ( view.find('.youtube-preview .fa-youtube-play').length ) {
            div.controller('youtube play icon')(view);
          }

          // Truncate

          setTimeout(function () {
            new (div.controller('truncate'))(view);
          }, 1000);

          // stats

          $promoted.text(item.promotions);

          if ( item.promotions ) {
            $promotedPercent.text(Math.floor(item.promotions * 100 / item.views) + '%');
          }

          else {
            $promotedPercent.text('0%');
          }

          // toggle promote

          $togglePromote.on('click', function togglePromoteWrapper () {
            div.controller('toggle promote')($(this), view, item);
          });

          // toggle details

          $toggleDetails
            .on('click', function () {
              div.controller('toggle details')(this, item);
            });

          // toggle arrow

          $toggleArrow.on('click', function () {
            div.controller('toggle arrow')($(this), item);
          });

          // is in

          if ( synapp.user ) {
            view.find('.is-in').css('visibility', 'visible');
          }

          // is new

          if ( item.is_new ) {
            setTimeout(function () {
              $togglePromote.click();
            });
          }

        }, 2000);

      });
  }

  module.exports = render;

} ();

},{"/home/francois/Dev/luigi/luigi":2,"string":51}],16:[function(require,module,exports){
! function () {

  'use strict';

  function toggleArrow ($target, item) {

    var div       =   this;
    var Panel     =   div.root.extension('Panel');

    var $panel    =   $target.closest('.panel');
    var $item     =   $target.closest('.item');
    var $children =   $item.find('>.collapsers >.children');

    // Animation in progress - don't do nothing

    if ( $children.hasClass('is-showing') || $children.hasClass('is-hiding') ) {
      return;
    }

    // Is shown so hide
    
    else if ( $children.hasClass('is-shown') ) {
      Panel.controller('scroll to point of attention')($item,
        function () {
          // Panel.controller('hide')($children);

          // $target.find('i.fa')
          //   .removeClass('fa-arrow-up')
          //   .addClass('fa-arrow-down');

        }.bind(this));
    }

    // else, show

    else {
      div.controller('expand')(item, $panel, $item, $children, $target);
    }
  }

  module.exports = toggleArrow;

} ();

},{}],17:[function(require,module,exports){
! function () {

  'use strict';

  function toggleDetails (trigger, item) {
    var div = this;

    var Panel = div.root.extension('Panel');

    // DOM elements

    var $panel      =   $(trigger).closest('.panel');
    var $item       =   $(trigger).closest('.item');
    var $details    =   $item.find('>.collapsers >.details');
    var $editor     =   $item.find('>.collapsers >.editor');
    var $promote    =   $item.find('>.collapsers >.evaluator');

    // helpers

    var scrollToPOA = Panel.controller('scroll to point of attention')
      .bind(Panel);

    var hide = Panel.controller('hide').bind(Panel);

    var reveal = Panel.controller('reveal').bind(Panel);

    // On reveal

    function onReveal () {
      div.controller('progress bar')($details, item);

      div.controller('invite people in')($details, item);

      if ( ! $details.hasClass('is-loaded') ) {
        div.controller('get item details')($details, item);

        $details
          .find('.edit-and-go-again-toggler')
          .eq(0)
          .on('click', function () {

            scrollToPOA($item, function () {
              Panel.controller('hide')($details, function () {
                luigi('tpl-creator')

                  .controller(function (view) {
                    div.controller('edit and go again')(view, item);
                  })

                  .controller(function (view) {
                    $editor
                      .find('.is-section')
                      .empty()
                      .append(view.find('.item'));

                    Panel.controller('reveal')($editor, $item);
                  });
              });
            });

              

            // div.render('edit and go again', item, function (editView) {
            //   console.log(editView)
            //   $editor
            //     .empty()
            //     .append(editView);
            // });
            // Panel.controller('reveal')($editor, $item);
          });
      }
    }

    // If details shown, then hide

    if ( $details.hasClass('is-shown') ) {
      scrollToPOA($item, function ()  {
        hide($details);
      });
    }

    else if ( $details.hasClass('is-showing') || $details.hasClass('is-hidding') ) {
      return;
    }
    
    else {

      /** If promote is shown, hide it first */

      if ( $promote.hasClass('is-shown') ) {
        scrollToPOA($item, function ()  {
          hide($promote, function () {
            reveal($details, $item, onReveal);
          });
        });
      }

      else {
        reveal($details, $item, onReveal);
      }
    }
  }

  module.exports = toggleDetails;

} ();

},{}],18:[function(require,module,exports){
! function () {

  'use strict';

  function toggleEditAndGoAgain ($details, $item, item) {
    var app = this;

    var Panel = app.importer.extension('Panel');

    var $editor = $item.find('>.collapsers >.editor');

    $details
      .find('.edit-and-go-again-toggler')
      .eq(0)
      .on('click', function () {
        Panel.controller('reveal')($editor, $item);
      });
  }

  module.exports = toggleEditAndGoAgain;

} ();

},{}],19:[function(require,module,exports){
! function () {

  'use strict';

  function togglePromote ($target, view, item) {
    var div       =   this;
    var Panel     =   div.root.extension('Panel');
    var Promote   =   div.root.extension('Promote');
    var Socket    =   div.root.emitter('socket');

    var $panel    =   $target.closest('.panel');
    var $item     =   $target.closest('.item');
    var $promote  =   $item.find('>.collapsers >.evaluator');

    if ( $promote.hasClass('is-showing') || $promote.hasClass('is-hiding') ) {
      return false;
    }

    else if ( $promote.hasClass('is-shown') ) {
      Panel.controller('scroll to point of attention')($item,
        function () {
          Panel.controller('hide')($promote);
        });
    }

    else {
      // Show tip

      $('#modal-tip-evaluate').modal('show');

      Panel.controller('reveal')($promote, view,
        
        function onPromoteShown () {

          var evaluationExists = Promote.model('evaluations')
            .some(function (evaluation) {
              return evaluation.item === item._id;
            });

          if ( ! evaluationExists ) {
            Socket.emit('get evaluation', item);
          }

        });
    }

    return false;
  }

  module.exports = togglePromote;

} ();

},{}],20:[function(require,module,exports){
; ! function () {

  'use strict';

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

      Synapp.extension('Panel').controller('scroll to point of attention')
        (self.item, function () {

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

},{}],21:[function(require,module,exports){
! function () {

  'use strict';

  function updatePanelModel(panel, items) {

    var div     =   this;
    var Panel   =   this.root.extension('Panel');

    // Update offset (skip)

    panel.skip += (items.length - 1);

    // Update panels model

    Panel.model('panels', Panel.model('panels').map(function (pane) {
      var match;

      if ( pane.type === panel.type ) {
        match = true;
      }

      if ( panel.parent && pane.parent !== panel.parent ) {
        match = false;
      }

      if ( match ) {
        return panel;
      }

      return pane;
    }));

    div.watch.emit('panel model updated', panel, items);
  }

  module.exports = updatePanelModel;

} ();

},{}],22:[function(require,module,exports){
! function () {

  'use strict';

  function updatePanelView(panel, items) {

    var div     =   this;
    var Panel   =   this.root.extension('Panel');
    var Queue   =   this.root.queue;

    var panelId = '#panel-' + panel.type;

    if ( panel.parent ) {
      panelId += '-' + panel.parent;
    }

    var $panel  =   $(panelId);

    if ( ! $panel.length ) {
      throw new Error('Could not find panel ' + panelId);
    }

    // $panel.addClass('is-filling');

    items.forEach(function (item) {

      $panel.find('.is-canvas:first')
        .attr('id', 'item-' + item._id)
        .removeClass('is-canvas');
    });

    div.watch.emit('panel view updated');
  }

  module.exports = updatePanelView;

} ();

},{}],23:[function(require,module,exports){
; ! function () {

  'use strict';

  function youTubePlayIcon (view) {

    var div = this;

    setTimeout(function () {
      
      // view.find('.youtube-preview .icon-play').css('background',
      //   'url(' + view.find('.youtube-preview img').attr('src') + ')');

      var img = view.find('.youtube-preview img');

      var icon = view.find('.youtube-preview .icon-play');

      icon.css('width', img.width() + 'px');

      icon.css('height', img.height() + 'px');

      img.css('margin-bottom', '-' + img.height() + 'px');

      $(window).on('resize', function () {

        console.log('resizing')

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
        
    }, 1000);
  }

  module.exports = youTubePlayIcon;

}();

},{}],24:[function(require,module,exports){
; ! function () {

  'use strict';

  var regexYouTube = /youtu\.?be.+v=([^&]+)/;

  function youTubePreview (url, server) {
    var youtube;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });

      // var raw = '<div class="video-container">' +
      //     '<iframe src="http://www.youtube.com/embed/' + youtube + '" frameborder="0" width="300" height="175"></iframe>' +
      //   '</div>';

      var raw = '<div class="youtube-preview" data-video="' + youtube + '"><img alt="YouTube" src="http://img.youtube.com/vi/' + youtube + '/hqdefault.jpg" class="img-responsive youtube-thumbnail" /><div class="icon-play"><i class="fa fa-youtube-play fa-5x"></i></div></div>';

      if ( server ) {
        return raw;
      }

      else {
        return $(raw);
      }
    }
  }

  module.exports = youTubePreview;

}();

},{}],25:[function(require,module,exports){
/**

  oo   dP                                
       88                                
  dP d8888P .d8888b. 88d8b.d8b. .d8888b. 
  88   88   88ooood8 88'`88'`88 Y8ooooo. 
  88   88   88.  ... 88  88  88       88 
  dP   dP   `88888P' dP  dP  dP `88888P' 

*/

! function () {

  'use strict';

  module.exports = {
    
    models: {
      items: []
    },
    
    controllers: {
      'youtube':                  require('./controllers/youtube'),
      'youtube play icon':        require('./controllers/youtube-play-icon'),
      'item media':               require('./controllers/item-media'),
      'truncate':                 require('./controllers/truncate'),
      'toggle details':           require('./controllers/toggle-details'),
      'progress bar':             require('./controllers/progress-bar'),
      'invite people in':         require('./controllers/invite-people-in'),
      'get item details':         require('./controllers/get-item-details'),
      'get items':                require('./controllers/get-items'),
      'create item':              require('./controllers/create-item'),
      'toggle edit and go again': require('./controllers/toggle-edit-and-go-again'),
      'update panel model':       require('./controllers/update-panel-model'),
      'update panel view':        require('./controllers/update-panel-view'),
      'render':                   require('./controllers/render'),
      'expand':                   require('./controllers/expand'),
      'place item in panel':      require('./controllers/place-item-in-panel'),
      'details votes':            require('./controllers/details-votes'),
      'edit and go again':        require('./controllers/edit-and-go-again'),
      'toggle promote':           require('./controllers/toggle-promote'),
      'toggle arrow':             require('./controllers/toggle-arrow')
    },

    run: function () {
      
      this.controller('get items')();

      this.controller('create item')();

    }
  };

} ();

},{"./controllers/create-item":5,"./controllers/details-votes":6,"./controllers/edit-and-go-again":7,"./controllers/expand":8,"./controllers/get-item-details":9,"./controllers/get-items":10,"./controllers/invite-people-in":11,"./controllers/item-media":12,"./controllers/place-item-in-panel":13,"./controllers/progress-bar":14,"./controllers/render":15,"./controllers/toggle-arrow":16,"./controllers/toggle-details":17,"./controllers/toggle-edit-and-go-again":18,"./controllers/toggle-promote":19,"./controllers/truncate":20,"./controllers/update-panel-model":21,"./controllers/update-panel-view":22,"./controllers/youtube":24,"./controllers/youtube-play-icon":23}],26:[function(require,module,exports){
! function () {

  'use strict';

  function create ($createButton) {

    var div           =   this;

    var Panel         =   div.root.extension('Panel');

    var Socket        =   div.root.emitter('socket');

    // Overscoping $creator

    var $creator      =   $createButton.closest('.creator');

    // Identify Panel

    var $panel        =   $createButton.closest('.panel');

    // Panel ID split to easily get panel parent(1) and panel type(2)

    var panelId       =   $panel.attr('id').split('-');

    // Subject field

    var $subject      =   $creator.find('[name="subject"]');

    // Description field

    var $description  =   $creator.find('[name="description"]');

    // Reference field
    
    var $reference    =   $creator.find('[name="reference"]');

    // Reset errors in case of any from previous call

    $subject.removeClass('error');

    $description.removeClass('error');

    // Subject empty? Trigger visual error

    if ( ! $subject.val() ) {
      $subject.addClass('error').focus();
    }

    // Description empty? Trigger visual error

    else if ( ! $description.val() ) {
      $description.addClass('error').focus();
    }

    // No Errors? Proceed to back-end transmission

    else {

      // Building item to send

      var item = {
        user:         synapp.user,
        subject:      $subject.val(),
        description:  $description.val(),
        type:         panelId[1],
        references:   [
          {
            url:          $reference.val(),
            title:        $reference.data('title')
          }
        ]
      };

      // If item has parent

      if ( panelId[2] ) {
        item.parent = panelId[2];
      }

      // If item has image

      if ( $creator.find('.preview-image').length ) {
        item.image = $creator.find('.preview-image').attr('src');
      }

      // If item image, stream upload first the image
      // and then emit to socket create item

      if ( item.image ) {

        var file = $creator.find('.preview-image').data('file');

        var stream = ss.createStream();

        ss(Socket).emit('upload image', stream,
          { size: file.size, name: file.name });
        
        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', function () {
          item.image = file.name;
          div.controller('new item')($creator, $panel, item);
        });
      }

      else {
        div.controller('new item')($creator, $panel, item);
      }

      // Cleaning form

      $subject.val('');
      $description.val('');
      $reference.val('');
    }
  }

  module.exports = create;

} ();

},{}],27:[function(require,module,exports){
! function () {

  'use strict';

  function findCreator (view) {
    return view.find('.creator:first');
  }

  module.exports = findCreator;

} ();

},{}],28:[function(require,module,exports){
! function () {

  'use strict';

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

  module.exports = hide;

} ();

},{}],29:[function(require,module,exports){
! function () {

  'use strict';

  function makePanel (type, parent) {

    var div     =   this;
    var id      =   'panel-' + type;

    if ( parent ) {
      id += '-' + parent;
    }

    return luigi('tpl-panel')
      .controller(function ($subPanel) {

        $subPanel.attr('id', id);

        $subPanel.addClass('type-' + type);
      });

  }

  module.exports = makePanel;

} ();

},{}],30:[function(require,module,exports){
! function () {

  'use strict';

  function newItem ($creator, $panel, item) {

    var div     =   this;
    var Socket  =   div.root.emitter('socket');
    var Panel   =   div.root.extension('Panel');

    Panel.controller('hide')($creator, function () {
      luigi('tpl-item')
        .controller(function ($item) {

          var image = $creator.find('.item-media img');

          if ( image.length ) {

            if ( image.hasClass('youtube-thumbnail') ) {
              $item.find('.item-media').empty()
                .append(image.closest('.youtube-preview'));
            }

            else {
              $item.find('.item-media img')
                .attr('src', image.attr('src'));
            }
          }

          $panel.find('.new-item:first').append($item);

          Panel.controller('reveal')($panel.find('.new-item:first'),
            $panel, function () {
              $item.addClass('is-new');
              $item.insertAfter($panel.find('.new-item:first'));
              $panel.find('.new-item:first').empty().hide();

              Socket.emit('create item', item);
            });
        });
    });
  }

  module.exports = newItem;

} ();

},{}],31:[function(require,module,exports){
/**
  *  Render and insert a panel
  */

! function () {

  'use strict';

  /**
   *  @return 
   *  @arg {Object} panel
   */

  function render (panel) {

    console.log('%c push panels', 'font-weight: bold; color: magenta', panel);

    var div = this;

    var Item = div.root.extension('Item');

    var intercept = div.domain.intercept;

    var Socket = div.root.emitter('socket');

    // Set panel ID

    var id = 'panel-' + panel.type;

    if ( panel.parent ) {
      id += '-' + panel.parent;
    }

    console.log('%c render panel', 'font-weight: bold', panel);

    // render function

    function _render(view) {
      // Add type as class

      view.addClass('type-' + panel.type);

      // Split panel

      if ( panel.split ) {
        view.addClass('split-view');
      }

      // Panel title
      
      view.find('.panel-title').eq(0).text(panel.type);

      var $creator = view.find(div.model('$creator'));

      $creator.addClass(panel.type);
                  
      $creator.find('>.is-section .button-create')
        .on('click', function () {
          div.controller('create')($(this));
        });

      // Toggle creator view

      view.find('.toggle-creator').on('click', function () {

        if ( $creator.hasClass('is-showing') || $creator.hasClass('is-hiding') ) {
          return;
        }
        else if ( $creator.hasClass('is-shown') ) {
          div.controller('hide')($creator);
        }
        else {
          // console.log('revealing')
          div.controller('reveal')($creator, view, intercept());
        }
      });

      // Upload

      div.controller('upload')($creator.find('.drop-box'));

      // url title fecther

      $creator.find('.reference').on('change', function () {
        var board = $('.reference-board');
        var reference = $(this);

        board.removeClass('hide').text('Looking up');

        div.root.emitter('socket').emit('get url title', $(this).val(),
          function (error, ref) {
            if ( ref.title ) {
              board.text(ref.title);
              reference.data('title', ref.title);

              var yt = Item.controller('youtube')(ref.url);

              if ( yt ) {
                $creator.find('.item-media')
                  .empty()
                  .append(yt);

                Item.controller('youtube play icon')($creator);
              }
            }
            else {
              board.text('Looking up')
                .addClass('hide');
            }
          });
      });

      // Load more

      view.find('>.panel-body >.load-more a')
        .on('click', function loadMore () {

          var load_more = this;

          if ( $creator.hasClass('is-showing') ) {
            return false;
          }

          if ( view.find('>.panel-body >.loading-more:visible').length ) {
            console.log('in proggress');
            return false;
          }

          if ( $creator.hasClass('is-shown') ) {
            div.controller('hide')($creator);
          }

          view.find('>.panel-body >.loading-more .fa-check')
            .hide();

          view.find('>.panel-body >.loading-more')
            .show();

          // Panel skip is updated by Item which in turns updated model, so reference to panel got from push event is now obsolete, so let's fetch it again

          var panel2 = div.model('panels').reduce(function (c, p) {
            var match = false;

            if ( p.type === panel.type ) {
              match = true;
            }

            if ( panel.parent && (p.parent !== panel.parent) ) {
              match = false;
            }

            if ( match ) {
              c = p;
            }

            return c;
          }, null) || panel;

          Socket.emit('get items', panel2);

          Socket.once('got items', function (panelItems) {

            console.warn('kamikaze')

            view.find('>.panel-body >.loading-more .fa-spin')
              .hide();

            view.find('>.panel-body >.loading-more .fa-check')
              .show();

            view.find('>.panel-body >.loading-more span')
              .text(panelItems.items.length + ' items found');

            var len = ( synapp['navigator batch size'] - 1 );

            for ( var i = 0; i < len; i ++ ) {
              setTimeout(function () {
                luigi('tpl-item')

                  .controller(function ($item) {
                    
                    view.find('.next-item:first').append($item);
                    
                    div.controller('reveal')(
                      view.find('.next-item:first'),
                      $(load_more),
                      function () {
                        $item.insertBefore(view.find('.next-item:first'));
                        view.find('.next-item:first').empty().hide();
                      });
                  });
                }, 800 * i);
              }
          });

          return false;
        });

      if ( synapp.user ) {
        $('.is-in').css('visibility', 'visible');
      }

      // Emit about it

      div.watch.emit('panel view rendered', panel, view);
    }

    luigi(id)
      .on('error', function (error) {
        if ( error.code === 'NO_SUCH_TEMPLATE' ) {
          console.warn('%c Render Panel: Panel not found', 'font-weight: bold; color: orange', panel);
          luigi('tpl-panel')
            .on('error', div.domain.intercept())
            .controller(function (panelView) {

              panelView.attr('id', id);

              var item = $('#item-' + panel.parent);

              item.find('>.collapsers >.children >.is-section')
                .append(panelView);

              div.controller('reveal')(item.find('>.collapsers >.children'), item,
                function () {
                  luigi(id).controller(_render);
                });

            });
        }
      })
      .controller(_render);
  }

  module.exports = render;

} ();

},{}],32:[function(require,module,exports){
! function () {

  'use strict';

  function _reveal (elem, poa, cb) {


    var app = this;

    elem.removeClass('is-hidden').addClass('is-showing');

    if ( poa ) {
      app.controller('scroll to point of attention')(poa, function () {
        app.controller('show')(elem, cb);
      });
    }

    else {
      app.controller('show')(elem, cb);
    }
  }

  function reveal (elem, poa, cb) {

    var app = this;

    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    console.log('%c reveal', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    // Eventual element to hide first

    var hider;

    // Find elem's panel

    var $panel = elem.closest('.panel');

    // Find elem's item if any

    var $item = elem.closest('.item');

    // Don't animate if something else is animating

    // if ( $item.find('.is-showing').length || $item.find('.is-hiding').length ) {
    //   console.log('revealing', 'other animations in progress in item');
    //   return cb(new Error('arrrgh so'));
    // }

    // // Hide Creators if any

    // if ( ! elem.hasClass('.creator') &&
    //   $panel.find('>.panel-body >.creator.is-shown').length ) {
    //   hider = $panel.find('>.panel-body >.creator.is-shown');
    // }

    // // Hide other shown elements that share same item's level

    // if ( $item.length && $item.find('.is-shown').not('.children').length ) {
    //   hider = $item.find('.is-shown').not('.children');
    // }

    // If hiders

    if (  hider ) {
      // app.controller('hide')(hider, function () {
      //   _reveal.apply(app, [elem, poa, cb]);
      // });
    }

    else {
      _reveal.apply(app, [elem, poa, cb]);
    }
  }

  module.exports = reveal;

} ();

},{}],33:[function(require,module,exports){
; ! function () {

  'use strict';

  function scrollToPointOfAttention (pointOfAttention, cb, speed) {
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

    // $('body,html').animate({
    //   scrollTop: poa + 'px'
    // }, speed || 500, 'swing', function () {
    //   if ( typeof cb === 'function' ) {
    //     cb();
    //   }
    // });
  }

  module.exports = scrollToPointOfAttention;

}();

},{}],34:[function(require,module,exports){
; ! function () {

  'use strict';

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

    // elem.find('.is-section:first').animate(
      
    //   {
    //     'margin-top': 0,
    //     // 'padding-top': 0,
    //   },

    //   500,

    //   function () {
    //     elem.removeClass('is-showing').addClass('is-shown');
        
    //     if ( elem.css('margin-top') !== 0 ) {
    //       elem.animate({'margin-top': 0}, 250);
    //     }
        
    //     if ( cb ) {
    //       cb();
    //     }
    //   });

    elem.animate({
       opacity: 1
      }, 500);
  }

  module.exports = show;

}();

},{}],35:[function(require,module,exports){
! function () {

  'use strict';

  function toggleCreator ($creator) {
    if ( $creator.hasClass('is-showing') || $creator.hasClass('is-hiding') ) {
      return;
    }
    else if ( $creator.hasClass('is-shown') ) {
      div.controller('hide')($creator);
    }
    else {
      div.controller('reveal')($creator, view);
    }
  }

  module.exports = toggleCreator;

} ();

},{}],36:[function(require,module,exports){
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
      dropbox.find('input').on('change', handler);
      dropbox.on('dragover', hover);
      dropbox.on('dragleave', hover);
      dropbox.on('drop', handler);
    }
  }

  module.exports = init;

} ();

},{}],37:[function(require,module,exports){
/**
                                            
                                                
     888888ba                             dP 
     88    `8b                            88 
    a88aaaa8P' .d8888b. 88d888b. .d8888b. 88 
     88        88'  `88 88'  `88 88ooood8 88 
     88        88.  .88 88    88 88.  ... 88 
     dP        `88888P8 dP    dP `88888P' dP 

                                        
*/

! function () {

  'use strict';

  module.exports = {

    models: {
      panels: [],
      $creator: '.creator:first'
    },
    
    controllers: {
      'scroll to point of attention':
        require('./controllers/scroll-to-point-of-attention'),

      'show':             require('./controllers/show'),
      'make':             require('./controllers/make'),
      'hide':             require('./controllers/hide'),
      'reveal':           require('./controllers/reveal'),
      'upload':           require('./controllers/upload'),
      'render':           require('./controllers/render'),
      'toggle creator':   require('./controllers/toggle-creator'),
      'create':           require('./controllers/create'),
      'find creator':     require('./controllers/find-creator'),
      'new item':         require('./controllers/new-item')
    },

    run: function () {
      var div = this;

      // function to insert top level panel if not inserted

      function topLevelPanel () {
        if ( ! div.model('panels').length ) {
          div.push('panels', {
            type: 'Topic',
            size: synapp['navigator batch size'],
            skip: 0
          });
        }
      }

      // trigger topLevelPanel when socket connects

      div.root.model('socket_conn')
        ?   topLevelPanel()
        :   div.root.emitter('socket').once('connect', topLevelPanel);

      // on new panel added to model, render the panel

      div.watch
        .on('push panels', div.controller('render'));

    }
  };

} ();

},{"./controllers/create":26,"./controllers/find-creator":27,"./controllers/hide":28,"./controllers/make":29,"./controllers/new-item":30,"./controllers/render":31,"./controllers/reveal":32,"./controllers/scroll-to-point-of-attention":33,"./controllers/show":34,"./controllers/toggle-creator":35,"./controllers/upload":36}],38:[function(require,module,exports){
! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function getEvaluation () {
    var div = this;

    var Socket = div.root.emitter('socket');
    var Panel = div.root.extension('Panel');

    Socket.on('got evaluation', function (evaluation) {

      evaluation.cursor = 1;
      evaluation.limit = 5;

      if ( evaluation.items.length < 6 ) {
        evaluation.limit = evaluation.items.length - 1;

        if ( ! evaluation.limit && evaluation.items.length === 1 ) {
          evaluation.limit = 1;
        }
      }

      div.push('evaluations', evaluation);

    });

    div.watch.on('push evaluations', function (evaluation) {

      var $promote = $('#item-' + evaluation.item + ' >.collapsers >.evaluator');

      console.info('render evaluation', evaluation.item);

      luigi($promote)

        .controller(div.controller('render')(evaluation));
    });

  }

  module.exports = getEvaluation;

} ();

},{"/home/francois/Dev/luigi/luigi":2}],39:[function(require,module,exports){
! function () {

  'use strict';

  function render (evaluation) {

    var div         =   this;

    var Socket      =   div.root.emitter('socket');

    var Panel       =   div.root.extension('Panel');

    var Item        =   div.root.extension('Item');

    var promoteDiv  =   Div.factory({

    });

    return function (view) {
      var $sideBySide   =   view.find('.items-side-by-side');

      var $item = view.closest('.item');

      // Limit

      promoteDiv.bind('limit', function (limit) {
        view.find('.limit').text(limit);
      });

      promoteDiv.model('limit', evaluation.limit);

      // Cursor

      promoteDiv.bind('cursor', function (cursor) {
        view.find('.cursor').text(cursor);

        if ( cursor < promoteDiv.model('limit') ) {
          view.find('.finish').text('Neither');
        }
        else {
          view.find('.finish').text('Finish');
        }
      });

      promoteDiv.model('cursor', evaluation.cursor);

      // Item

      function evaluationItem (eItem, pos) {

        var hand = pos ? 'right' : 'left';

        // If null

        if ( ! eItem ) {
          $sideBySide
            .find('.subject.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.is-des.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.sliders.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.' + hand + '-item .feedback')
            .closest('.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.' + hand + '-item .promote')
            .closest('.' + hand + '-item')
            .hide();

          // If one missing

          $sideBySide.find('.promote-label').hide();
          $sideBySide.find('.promote').hide();

          return;
        }

        // Increment views counter

        Socket.emit('add view', eItem._id);

        // Image

        var image;

        if ( eItem._id === evaluation.item ) {
          image = $('#item-' + eItem._id)
            .find('>.item-media-wrapper img')
            .clone();

          if ( image.hasClass('youtube-thumbnail') ) {

            image = $('#item-' + eItem._id).find('.youtube-preview')
              .clone();
          }
        }

        image = image || Item.controller('item media')(eItem);

        if ( image.hasClass('youtube-preview') ) {
          setTimeout(function () {
            Item.controller('youtube play icon')(view);
          }, 1000);
        }

        $sideBySide
          .find('.image.' + hand + '-item')
          .empty()
          .append(image);

        // Subject

        $sideBySide.find('.subject.' + hand + '-item h3')
          .text(eItem.subject);

        // Description

        $sideBySide.find('.is-des.' + hand + '-item .description')
          .text(eItem.description);

        // References

        if ( eItem.references.length ) {
          $sideBySide.find('.references.' + hand + '-item a')
            .attr('href', eItem.references[0].url)
            .text(eItem.references[0].title || eItem.references[0].url);
        }

        // Sliders

        $sideBySide.find('.sliders.' + hand + '-item')
          .empty();

        console.info('criterias', evaluation.criterias.length);

        evaluation.criterias.forEach(function (criteria) {

          // Render sliders template

          luigi('tpl-promote-sliders')

            .controller(function ($sliders) {
              $sliders.find('.criteria-name').text(criteria.name);

              $sliders.find('input[type="range"]')
                .data('criteria', criteria._id)
                .rangeslider();

              $sideBySide
                .find('.sliders.' + hand + '-item')
                .append($sliders);
            });

        });

        // Promote button

        $sideBySide.find('.' + hand + '-item .promote')
          .data('position', pos);
      }

      // Left

      promoteDiv.bind('left', function (left, old, event) {
        evaluationItem(left, 0);
        
        if ( left ) {
          view.find('.left-item .promote').text(left.subject);
        }
      });

      promoteDiv.model('left', evaluation.items[0]);

      // Right

      promoteDiv.bind('right', function (right) {
        evaluationItem(right, 1);
        
        if ( right ) {
          view.find('.right-item .promote').text(right.subject);
        }
      });

      promoteDiv.model('right', evaluation.items[1]);

      // Promote

      view.find('.promote').on('click', function () {
        Panel.controller('scroll to point of attention')(view);

        var pos = $(this).data('position');

        var unpromoted = pos ? 0 : 1;

        if ( promoteDiv.model('cursor') < promoteDiv.model('limit') ) {

          promoteDiv.inc('cursor');

          if ( unpromoted ) {

            Socket.emit('promote', promoteDiv.model('left'));

            saveItem('right');

            var rights = [view.find('.right-item').length, 0];

            view.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                promoteDiv.model('right', evaluation.items[promoteDiv.model('cursor')]);

                view.find('.right-item').animate({
                  opacity: 1
                });
              }
            });
          }

          else {
            Socket.emit('promote', promoteDiv.model('right'));

            saveItem('left');

            var lefts = [view.find('.left-item').length, 0];

            view.find('.left-item').animate({
              opacity: 0
            }, function () {

              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                promoteDiv.model('left', evaluation.items[promoteDiv.model('cursor')]);

                view.find('.left-item').animate({
                  opacity: 1
                });
              }
            });
          }

        }

        else {
          finish();
        }
      });

      // Neither / Finish

      view.find('.finish').on('click', function () {

        Panel.controller('scroll to point of attention')(view);

        if ( promoteDiv.model('cursor') === promoteDiv.model('limit') ) {
          finish();
        }
        
        else {
          // Left

          promoteDiv.inc('cursor');

          saveItem('left');

          var lefts = [view.find('.left-item').length, 0];

          view.find('.left-item').animate({
              opacity: 0
            }, function () {
              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                promoteDiv.model('left', evaluation.items[promoteDiv.model('cursor')]);

                view.find('.left-item').animate({
                  opacity: 1
                });
              }
            });

          // Right

          promoteDiv.inc('cursor');

          saveItem('right');

          var rights = [view.find('.right-item').length, 0];

          view.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                promoteDiv.model('right', evaluation.items[promoteDiv.model('cursor')]);

                view.find('.right-item').animate({
                  opacity: 1
                });
              }
            });


          // Adjust cursor

          if ( promoteDiv.model('limit') - promoteDiv.model('cursor') === 1 ) {
            promoteDiv.model('cursor', promoteDiv.model('limit'));
          }
        }
      });

      // Save votes and feeback

      function saveItem (hand) {
   
        // feedback

        var feedback = view.find('.' +  hand + '-item .feedback');

        if ( feedback.val() ) {
          Socket.emit('insert feedback', {
            item: promoteDiv.model(hand)._id,
            user: synapp.user,
            feedback: feedback.val()
          });

          feedback.val('');
        }

        // votes

        var votes = [];

        $sideBySide
          .find('.' +  hand + '-item input[type="range"]:visible')
          .each(function () {
            var vote = {
              item: promoteDiv.model(hand)._id,
              user: synapp.user,
              value: +$(this).val(),
              criteria: $(this).data('criteria')
            };

            votes.push(vote);
          });

        Socket.emit('insert votes', votes);
      }

      // Finish

      function finish () {

        view.find('.promote').off('click');
        view.find('.finish').off('click');

        if ( promoteDiv.model('left') ) {
          saveItem('left');
        }

        if ( promoteDiv.model('right') ) {
          saveItem('right');
        }

        view.find('.promote,.finish').off('click');

        var evaluations = div.model('evaluations');

        evaluations = evaluations.filter(function ($evaluation) {
          return $evaluation.item !== evaluation.item;
        });

        div.model('evaluations', evaluations);

        Panel.controller('hide')(view,
          function () {
            $item.find('.toggle-details').eq(0).click();
            $item.find('.details:eq(0) .feedback-pending')
              .removeClass('hide');
          });
      }
    }
  }

  module.exports = render;

} ();

},{}],40:[function(require,module,exports){
/**

  88888888b                   dP                     dP   oo                   
   88                          88                     88                        
  a88aaaa    dP   .dP .d8888b. 88 dP    dP .d8888b. d8888P dP .d8888b. 88d888b. 
   88        88   d8' 88'  `88 88 88    88 88'  `88   88   88 88'  `88 88'  `88 
   88        88 .88'  88.  .88 88 88.  .88 88.  .88   88   88 88.  .88 88    88 
   88888888P 8888P'   `88888P8 dP `88888P' `88888P8   dP   dP `88888P' dP    dP

*/

! function () {

  'use strict';

  module.exports = {
    
    models: {
      evaluations: []
    },

    controllers: {
      'get evaluation': require('./controllers/get-evaluation'),
      'render': require('./controllers/render')
    },

    run: function () {
      this.controller('get evaluation')();
    }
  };

} ();

},{"./controllers/get-evaluation":38,"./controllers/render":39}],41:[function(require,module,exports){
/**
                                        
                                            
    $$    $$                                
    $$    $$                                
    $$    $$   $$$$$$$   $$$$$$    $$$$$$   
    $$    $$  $$        $$    $$  $$    $$  
    $$    $$   $$$$$$   $$$$$$$$  $$        
    $$    $$        $$  $$        $$        
     $$$$$$   $$$$$$$    $$$$$$$  $$        
                                            
                                        
                                        
*/

! function () {

  'use strict';

  module.exports = {
    models: {
      user:   synapp.user,
      online: 0
    },

    run: function () {
      
      var div = this;

      var Socket = div.root.emitter('socket');

      var Queue = div.root.queue;

      Socket.on('online users', function (online) {
        div.model('online', online);
      });

      div.bind({ model: 'online' }, function (users) {
        $('.online-users').text(users);
      });

      if ( synapp.user ) {
        $('.is-in').css('visibility', 'visible');
      }
    }
  };

} ();

},{}],42:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             

       $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$ 
      $$        $$    $$  $$    $$        $$  $$    $$  $$    $$
       $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$
            $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$
      $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$ 
                      $$                      $$        $$      
                      $$                      $$        $$     
                 $$$$$$                       $$        $$                     

    ***/

;! function () {

  'use strict';

  window.Div    =   require('/home/francois/Dev/div.js/div');

  window.luigi  =   require('/home/francois/Dev/luigi/luigi');

  window.Synapp =   Div.factory(require('./synapp/index'));

  Synapp.run();

}();

},{"./synapp/index":43,"/home/francois/Dev/div.js/div":1,"/home/francois/Dev/luigi/luigi":2}],43:[function(require,module,exports){
 /**
                 


   $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$   
  $$        $$    $$  $$    $$        $$  $$    $$  $$    $$  
   $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$  
        $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$  
  $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$   
                  $$                      $$        $$        
            $$    $$                      $$        $$        
             $$$$$$                       $$        $$        
                          
*/


;! function () {

  'use strict';

  module.exports = {

    /** div events */

    "on": {

      /** on div error */

      "error": function (error) {
        console.error(error);
      }
    },

    models: {
      socket_conn: false
    },

    /** div extensions */
    
    extensions: {
      "User":         require('../User/'),
      "Panel":        require('../Panel/'),
      "Item":         require('../Item/'),
      "Intro":        require('../Intro/'),
      "Promote":      require('../Promote/')
    },
    
    /** div emitters */

    "emitters" : {
      socket: io.connect('http://' + window.location.hostname + ':' +
        window.location.port),
      // queue: new (require('/home/francois/Dev/queue.js/'))()
    },
    
    // controllers: {
    //   'bootstrap/responsive-image':
    //     require('./controllers/bootstrap/responsive-image')
    // },

    /** run div */
    
    run: function () {

      for ( var ext in this.extensions ) {
        this.extensions[ext].on('error', function (error) {
          this.emit('error', error);
        }.bind(this));
      }

      this.on('error', function (error) {
        console.error(error);
      });

      var div = this;

      /** On socket error */

      this.emitter('socket')
      
        .on('error', function (error) {
          console.warn('socket error', socket);
        })

        .on('connect', function () {
          div.model('socket_conn', true);
        });

      /** Extensions */

      var User      =     this.extension('User');
      var Intro     =     this.extension('Intro');
      var Panel     =     this.extension('Panel');
      var Item      =     this.extension('Item');
      var Promote   =     this.extension('Promote');

      /** User Run() */

      User.run();

      /** If panel page */

      if ( $('#intro').length ) {
        
        setTimeout(function () {
          Intro.run();
        }, 500);

        setTimeout(function () {
          Promote.run();
          Item.run();
          Panel.run();
        }, 1500);

        // 
        
        // 

      }
    }
  };

}();

},{"../Intro/":4,"../Item/":25,"../Panel/":37,"../Promote/":40,"../User/":41}],44:[function(require,module,exports){
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
},{"_process":48}],45:[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events');

	// Export Domain
	var domain = {};
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter();

		function emitError(e) {
			d.emit('error', e)
		}

		d.add = function(emitter){
			emitter.on('error', emitError);
		}
		d.remove = function(emitter){
			emitter.removeListener('error', emitError);
		}
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
},{"events":46}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],50:[function(require,module,exports){
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
},{"./support/isBuffer":49,"_process":48,"inherits":47}],51:[function(require,module,exports){
/*
string.js - Copyright (C) 2012-2014, JP Richardson <jprichardson@gmail.com>
*/

!(function() {
  "use strict";

  var VERSION = '2.2.0';

  var ENTITIES = {};

  // from http://semplicewebsites.com/removing-accents-javascript
  var latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","ẞ":"SS","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ß":"ss","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};

//******************************************************************************
// Added an initialize function which is essentially the code from the S
// constructor.  Now, the S constructor calls this and a new method named
// setValue calls it as well.  The setValue function allows constructors for
// modules that extend string.js to set the initial value of an object without
// knowing the internal workings of string.js.
//
// Also, all methods which return a new S object now call:
//
//      return new this.constructor(s);
//
// instead of:
//
//      return new S(s);
//
// This allows extended objects to keep their proper instanceOf and constructor.
//******************************************************************************

  function initialize (object, s) {
    if (s !== null && s !== undefined) {
      if (typeof s === 'string')
        object.s = s;
      else
        object.s = s.toString();
    } else {
      object.s = s; //null or undefined
    }

    object.orig = s; //original object, currently only used by toCSV() and toBoolean()

    if (s !== null && s !== undefined) {
      if (object.__defineGetter__) {
        object.__defineGetter__('length', function() {
          return object.s.length;
        })
      } else {
        object.length = s.length;
      }
    } else {
      object.length = -1;
    }
  }

  function S(s) {
  	initialize(this, s);
  }

  var __nsp = String.prototype;
  var __sp = S.prototype = {

    between: function(left, right) {
      var s = this.s;
      var startPos = s.indexOf(left);
      var endPos = s.indexOf(right, startPos + left.length);
      if (endPos == -1 && right != null) 
        return new this.constructor('')
      else if (endPos == -1 && right == null)
        return new this.constructor(s.substring(startPos + left.length))
      else 
        return new this.constructor(s.slice(startPos + left.length, endPos));
    },

    //# modified slightly from https://github.com/epeli/underscore.string
    camelize: function() {
      var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
      return new this.constructor(s);
    },

    capitalize: function() {
      return new this.constructor(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
    },

    charAt: function(index) {
      return this.s.charAt(index);
    },

    chompLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
         s = s.slice(prefix.length);
         return new this.constructor(s);
      } else {
        return this;
      }
    },

    chompRight: function(suffix) {
      if (this.endsWith(suffix)) {
        var s = this.s;
        s = s.slice(0, s.length - suffix.length);
        return new this.constructor(s);
      } else {
        return this;
      }
    },

    //#thanks Google
    collapseWhitespace: function() {
      var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
      return new this.constructor(s);
    },

    contains: function(ss) {
      return this.s.indexOf(ss) >= 0;
    },

    count: function(ss) {
      var count = 0
        , pos = this.s.indexOf(ss)

      while (pos >= 0) {
        count += 1
        pos = this.s.indexOf(ss, pos + 1)
      }

      return count
    },

    //#modified from https://github.com/epeli/underscore.string
    dasherize: function() {
      var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
      return new this.constructor(s);
    },

    latinise: function() {
      var s = this.replace(/[^A-Za-z0-9\[\] ]/g, function(x) { return latin_map[x] || x; });
      return new this.constructor(s);
    },

    decodeHtmlEntities: function() { //https://github.com/substack/node-ent/blob/master/index.js
      var s = this.s;
      s = s.replace(/&#(\d+);?/g, function (_, code) {
        return String.fromCharCode(code);
      })
      .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/&([^;\W]+;?)/g, function (m, e) {
        var ee = e.replace(/;$/, '');
        var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
            
        if (typeof target === 'number') {
          return String.fromCharCode(target);
        }
        else if (typeof target === 'string') {
          return target;
        }
        else {
          return m;
        }
      })

      return new this.constructor(s);
    },

    endsWith: function() {
      var suffixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < suffixes.length; ++i) {
        var l  = this.s.length - suffixes[i].length;
        if (l >= 0 && this.s.indexOf(suffixes[i], l) === l) return true;
      }
      return false;
    },

    escapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; }));
    },

    ensureLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
        return this;
      } else {
        return new this.constructor(prefix + s);
      }
    },

    ensureRight: function(suffix) {
      var s = this.s;
      if (this.endsWith(suffix))  {
        return this;
      } else {
        return new this.constructor(s + suffix);
      }
    },

    humanize: function() { //modified from underscore.string
      if (this.s === null || this.s === undefined)
        return new this.constructor('')
      var s = this.underscore().replace(/_id$/,'').replace(/_/g, ' ').trim().capitalize()
      return new this.constructor(s)
    },

    isAlpha: function() {
      return !/[^a-z\xDF-\xFF]|^$/.test(this.s.toLowerCase());
    },

    isAlphaNumeric: function() {
      return !/[^0-9a-z\xDF-\xFF]/.test(this.s.toLowerCase());
    },

    isEmpty: function() {
      return this.s === null || this.s === undefined ? true : /^[\s\xa0]*$/.test(this.s);
    },

    isLower: function() {
      return this.isAlpha() && this.s.toLowerCase() === this.s;
    },

    isNumeric: function() {
      return !/[^0-9]/.test(this.s);
    },

    isUpper: function() {
      return this.isAlpha() && this.s.toUpperCase() === this.s;
    },

    left: function(N) {
      if (N >= 0) {
        var s = this.s.substr(0, N);
        return new this.constructor(s);
      } else {
        return this.right(-N);
      }
    },
    
    lines: function() { //convert windows newlines to unix newlines then convert to an Array of lines
      return this.replaceAll('\r\n', '\n').s.split('\n');
    },

    pad: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      len = len - this.s.length;
      var left = Array(Math.ceil(len / 2) + 1).join(ch);
      var right = Array(Math.floor(len / 2) + 1).join(ch);
      return new this.constructor(left + this.s + right);
    },

    padLeft: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(Array(len - this.s.length + 1).join(ch) + this.s);
    },

    padRight: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(this.s + Array(len - this.s.length + 1).join(ch));
    },

    parseCSV: function(delimiter, qualifier, escape, lineDelimiter) { //try to parse no matter what
      delimiter = delimiter || ',';
      escape = escape || '\\'
      if (typeof qualifier == 'undefined')
        qualifier = '"';

      var i = 0, fieldBuffer = [], fields = [], len = this.s.length, inField = false, inUnqualifiedString = false, self = this;
      var ca = function(i){return self.s.charAt(i)};
      if (typeof lineDelimiter !== 'undefined') var rows = [];

      if (!qualifier)
        inField = true;

      while (i < len) {
        var current = ca(i);
        switch (current) {
          case escape:
            //fix for issues #32 and #35
            if (inField && ((escape !== qualifier) || ca(i+1) === qualifier)) {
              i += 1;
              fieldBuffer.push(ca(i));
              break;
            }
            if (escape !== qualifier) break;
          case qualifier:
            inField = !inField;
            break;
          case delimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
            }
            if (inField && qualifier)
              fieldBuffer.push(current);
            else {
              fields.push(fieldBuffer.join(''))
              fieldBuffer.length = 0;
            }
            break;
          case lineDelimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
              fields.push(fieldBuffer.join(''))
              rows.push(fields);
              fields = [];
              fieldBuffer.length = 0;
            }
            else if (inField) {
              fieldBuffer.push(current);
            } else {
              if (rows) {
                fields.push(fieldBuffer.join(''))
                rows.push(fields);
                fields = [];
                fieldBuffer.length = 0;
              }
            }
            break;
          case ' ':
            if (inField)
              fieldBuffer.push(current);
            break;
          default:
            if (inField)
              fieldBuffer.push(current);
            else if(current!==qualifier) {
              fieldBuffer.push(current);
              inField=true;
              inUnqualifiedString=true;
            }
            break;
        }
        i += 1;
      }

      fields.push(fieldBuffer.join(''));
      if (rows) {
        rows.push(fields);
        return rows;
      }
      return fields;
    },

    replaceAll: function(ss, r) {
      //var s = this.s.replace(new RegExp(ss, 'g'), r);
      var s = this.s.split(ss).join(r)
      return new this.constructor(s);
    },

    strip: function() {
      var ss = this.s;
      for(var i= 0, n=arguments.length; i<n; i++) {
        ss = ss.split(arguments[i]).join('');
      }
      return new this.constructor(ss);
    },

    right: function(N) {
      if (N >= 0) {
        var s = this.s.substr(this.s.length - N, N);
        return new this.constructor(s);
      } else {
        return this.left(-N);
      }
    },

    setValue: function (s) {
	  initialize(this, s);
	  return this;
    },

    slugify: function() {
      var sl = (new S(new S(this.s).latinise().s.replace(/[^\w\s-]/g, '').toLowerCase())).dasherize().s;
      if (sl.charAt(0) === '-')
        sl = sl.substr(1);
      return new this.constructor(sl);
    },

    startsWith: function() {
      var prefixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < prefixes.length; ++i) {
        if (this.s.lastIndexOf(prefixes[i], 0) === 0) return true;
      }
      return false;
    },

    stripPunctuation: function() {
      //return new this.constructor(this.s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
      return new this.constructor(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
    },

    stripTags: function() { //from sugar.js
      var s = this.s, args = arguments.length > 0 ? arguments : [''];
      multiArgs(args, function(tag) {
        s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), '');
      });
      return new this.constructor(s);
    },

    template: function(values, opening, closing) {
      var s = this.s
      var opening = opening || Export.TMPL_OPEN
      var closing = closing || Export.TMPL_CLOSE

      var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
      var matches = s.match(r) || [];

      matches.forEach(function(match) {
        var key = match.substring(opening.length, match.length - closing.length).trim();//chop {{ and }}
        var value = typeof values[key] == 'undefined' ? '' : values[key];
        s = s.replace(match, value);
      });
      return new this.constructor(s);
    },

    times: function(n) {
      return new this.constructor(new Array(n + 1).join(this.s));
    },

    toBoolean: function() {
      if (typeof this.orig === 'string') {
        var s = this.s.toLowerCase();
        return s === 'true' || s === 'yes' || s === 'on' || s === '1';
      } else
        return this.orig === true || this.orig === 1;
    },

    toFloat: function(precision) {
      var num = parseFloat(this.s)
      if (precision)
        return parseFloat(num.toFixed(precision))
      else
        return num
    },

    toInt: function() { //thanks Google
      // If the string starts with '0x' or '-0x', parse as hex.
      return /^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10)
    },

    trim: function() {
      var s;
      if (typeof __nsp.trim === 'undefined') 
        s = this.s.replace(/(^\s*|\s*$)/g, '')
      else 
        s = this.s.trim()
      return new this.constructor(s);
    },

    trimLeft: function() {
      var s;
      if (__nsp.trimLeft)
        s = this.s.trimLeft();
      else
        s = this.s.replace(/(^\s*)/g, '');
      return new this.constructor(s);
    },

    trimRight: function() {
      var s;
      if (__nsp.trimRight)
        s = this.s.trimRight();
      else
        s = this.s.replace(/\s+$/, '');
      return new this.constructor(s);
    },

    truncate: function(length, pruneStr) { //from underscore.string, author: github.com/rwz
      var str = this.s;

      length = ~~length;
      pruneStr = pruneStr || '...';

      if (str.length <= length) return new this.constructor(str);

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = new S(template.slice(0, template.length-1)).trimRight().s;

      return (template+pruneStr).length > str.length ? new S(str) : new S(str.slice(0, template.length)+pruneStr);
    },

    toCSV: function() {
      var delim = ',', qualifier = '"', escape = '\\', encloseNumbers = true, keys = false;
      var dataArray = [];

      function hasVal(it) {
        return it !== null && it !== '';
      }

      if (typeof arguments[0] === 'object') {
        delim = arguments[0].delimiter || delim;
        delim = arguments[0].separator || delim;
        qualifier = arguments[0].qualifier || qualifier;
        encloseNumbers = !!arguments[0].encloseNumbers;
        escape = arguments[0].escape || escape;
        keys = !!arguments[0].keys;
      } else if (typeof arguments[0] === 'string') {
        delim = arguments[0];
      }

      if (typeof arguments[1] === 'string')
        qualifier = arguments[1];

      if (arguments[1] === null)
        qualifier = null;

       if (this.orig instanceof Array)
        dataArray  = this.orig;
      else { //object
        for (var key in this.orig)
          if (this.orig.hasOwnProperty(key))
            if (keys)
              dataArray.push(key);
            else
              dataArray.push(this.orig[key]);
      }

      var rep = escape + qualifier;
      var buildString = [];
      for (var i = 0; i < dataArray.length; ++i) {
        var shouldQualify = hasVal(qualifier)
        if (typeof dataArray[i] == 'number')
          shouldQualify &= encloseNumbers;
        
        if (shouldQualify)
          buildString.push(qualifier);
        
        if (dataArray[i] !== null && dataArray[i] !== undefined) {
          var d = new S(dataArray[i]).replaceAll(qualifier, rep).s;
          buildString.push(d);
        } else 
          buildString.push('')

        if (shouldQualify)
          buildString.push(qualifier);
        
        if (delim)
          buildString.push(delim);
      }

      //chop last delim
      //console.log(buildString.length)
      buildString.length = buildString.length - 1;
      return new this.constructor(buildString.join(''));
    },

    toString: function() {
      return this.s;
    },

    //#modified from https://github.com/epeli/underscore.string
    underscore: function() {
      var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if ((new S(this.s.charAt(0))).isUpper()) {
        s = '_' + s;
      }
      return new this.constructor(s);
    },

    unescapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      }));
    },

    valueOf: function() {
      return this.s.valueOf();
    },

    //#Added a New Function called wrapHTML.
    wrapHTML: function (tagName, tagAttrs) {
      var s = this.s, el = (tagName == null) ? 'span' : tagName, elAttr = '', wrapped = '';
      if(typeof tagAttrs == 'object') for(var prop in tagAttrs) elAttr += ' ' + prop + '="' +(new this.constructor(tagAttrs[prop])).escapeHTML() + '"';
      s = wrapped.concat('<', el, elAttr, '>', this, '</', el, '>');
      return new this.constructor(s);
    }
  }

  var methodsAdded = [];
  function extendPrototype() {
    for (var name in __sp) {
      (function(name){
        var func = __sp[name];
        if (!__nsp.hasOwnProperty(name)) {
          methodsAdded.push(name);
          __nsp[name] = function() {
            String.prototype.s = this;
            return func.apply(this, arguments);
          }
        }
      })(name);
    }
  }

  function restorePrototype() {
    for (var i = 0; i < methodsAdded.length; ++i)
      delete String.prototype[methodsAdded[i]];
    methodsAdded.length = 0;
  }


/*************************************
/* Attach Native JavaScript String Properties
/*************************************/

  var nativeProperties = getNativeStringProperties();
  for (var name in nativeProperties) {
    (function(name) {
      var stringProp = __nsp[name];
      if (typeof stringProp == 'function') {
        //console.log(stringProp)
        if (!__sp[name]) {
          if (nativeProperties[name] === 'string') {
            __sp[name] = function() {
              //console.log(name)
              return new this.constructor(stringProp.apply(this, arguments));
            }
          } else {
            __sp[name] = stringProp;
          }
        }
      }
    })(name);
  }


/*************************************
/* Function Aliases
/*************************************/

  __sp.repeat = __sp.times;
  __sp.include = __sp.contains;
  __sp.toInteger = __sp.toInt;
  __sp.toBool = __sp.toBoolean;
  __sp.decodeHTMLEntities = __sp.decodeHtmlEntities //ensure consistent casing scheme of 'HTML'


//******************************************************************************
// Set the constructor.  Without this, string.js objects are instances of
// Object instead of S.
//******************************************************************************

  __sp.constructor = S;


/*************************************
/* Private Functions
/*************************************/

  function getNativeStringProperties() {
    var names = getNativeStringPropertyNames();
    var retObj = {};

    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var func = __nsp[name];
      try {
        var type = typeof func.apply('teststring', []);
        retObj[name] = type;
      } catch (e) {}
    }
    return retObj;
  }

  function getNativeStringPropertyNames() {
    var results = [];
    if (Object.getOwnPropertyNames) {
      results = Object.getOwnPropertyNames(__nsp);
      results.splice(results.indexOf('valueOf'), 1);
      results.splice(results.indexOf('toString'), 1);
      return results;
    } else { //meant for legacy cruft, this could probably be made more efficient
      var stringNames = {};
      var objectNames = [];
      for (var name in String.prototype)
        stringNames[name] = name;

      for (var name in Object.prototype)
        delete stringNames[name];

      //stringNames['toString'] = 'toString'; //this was deleted with the rest of the object names
      for (var name in stringNames) {
        results.push(name);
      }
      return results;
    }
  }

  function Export(str) {
    return new S(str);
  };

  //attach exports to StringJSWrapper
  Export.extendPrototype = extendPrototype;
  Export.restorePrototype = restorePrototype;
  Export.VERSION = VERSION;
  Export.TMPL_OPEN = '{{';
  Export.TMPL_CLOSE = '}}';
  Export.ENTITIES = ENTITIES;



/*************************************
/* Exports
/*************************************/

  if (typeof module !== 'undefined'  && typeof module.exports !== 'undefined') {
    module.exports = Export;

  } else {

    if(typeof define === "function" && define.amd) {
      define([], function() {
        return Export;
      });
    } else {
      window.S = Export;
    }
  }


/*************************************
/* 3rd Party Private Functions
/*************************************/

  //from sugar.js
  function multiArgs(args, fn) {
    var result = [], i;
    for(i = 0; i < args.length; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  //from underscore.string
  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
  };

  //from underscore.string
  var reversedEscapeChars = {};
  for(var key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

  ENTITIES = {
    "amp" : "&",
    "gt" : ">",
    "lt" : "<",
    "quot" : "\"",
    "apos" : "'",
    "AElig" : 198,
    "Aacute" : 193,
    "Acirc" : 194,
    "Agrave" : 192,
    "Aring" : 197,
    "Atilde" : 195,
    "Auml" : 196,
    "Ccedil" : 199,
    "ETH" : 208,
    "Eacute" : 201,
    "Ecirc" : 202,
    "Egrave" : 200,
    "Euml" : 203,
    "Iacute" : 205,
    "Icirc" : 206,
    "Igrave" : 204,
    "Iuml" : 207,
    "Ntilde" : 209,
    "Oacute" : 211,
    "Ocirc" : 212,
    "Ograve" : 210,
    "Oslash" : 216,
    "Otilde" : 213,
    "Ouml" : 214,
    "THORN" : 222,
    "Uacute" : 218,
    "Ucirc" : 219,
    "Ugrave" : 217,
    "Uuml" : 220,
    "Yacute" : 221,
    "aacute" : 225,
    "acirc" : 226,
    "aelig" : 230,
    "agrave" : 224,
    "aring" : 229,
    "atilde" : 227,
    "auml" : 228,
    "ccedil" : 231,
    "eacute" : 233,
    "ecirc" : 234,
    "egrave" : 232,
    "eth" : 240,
    "euml" : 235,
    "iacute" : 237,
    "icirc" : 238,
    "igrave" : 236,
    "iuml" : 239,
    "ntilde" : 241,
    "oacute" : 243,
    "ocirc" : 244,
    "ograve" : 242,
    "oslash" : 248,
    "otilde" : 245,
    "ouml" : 246,
    "szlig" : 223,
    "thorn" : 254,
    "uacute" : 250,
    "ucirc" : 251,
    "ugrave" : 249,
    "uuml" : 252,
    "yacute" : 253,
    "yuml" : 255,
    "copy" : 169,
    "reg" : 174,
    "nbsp" : 160,
    "iexcl" : 161,
    "cent" : 162,
    "pound" : 163,
    "curren" : 164,
    "yen" : 165,
    "brvbar" : 166,
    "sect" : 167,
    "uml" : 168,
    "ordf" : 170,
    "laquo" : 171,
    "not" : 172,
    "shy" : 173,
    "macr" : 175,
    "deg" : 176,
    "plusmn" : 177,
    "sup1" : 185,
    "sup2" : 178,
    "sup3" : 179,
    "acute" : 180,
    "micro" : 181,
    "para" : 182,
    "middot" : 183,
    "cedil" : 184,
    "ordm" : 186,
    "raquo" : 187,
    "frac14" : 188,
    "frac12" : 189,
    "frac34" : 190,
    "iquest" : 191,
    "times" : 215,
    "divide" : 247,
    "OElig;" : 338,
    "oelig;" : 339,
    "Scaron;" : 352,
    "scaron;" : 353,
    "Yuml;" : 376,
    "fnof;" : 402,
    "circ;" : 710,
    "tilde;" : 732,
    "Alpha;" : 913,
    "Beta;" : 914,
    "Gamma;" : 915,
    "Delta;" : 916,
    "Epsilon;" : 917,
    "Zeta;" : 918,
    "Eta;" : 919,
    "Theta;" : 920,
    "Iota;" : 921,
    "Kappa;" : 922,
    "Lambda;" : 923,
    "Mu;" : 924,
    "Nu;" : 925,
    "Xi;" : 926,
    "Omicron;" : 927,
    "Pi;" : 928,
    "Rho;" : 929,
    "Sigma;" : 931,
    "Tau;" : 932,
    "Upsilon;" : 933,
    "Phi;" : 934,
    "Chi;" : 935,
    "Psi;" : 936,
    "Omega;" : 937,
    "alpha;" : 945,
    "beta;" : 946,
    "gamma;" : 947,
    "delta;" : 948,
    "epsilon;" : 949,
    "zeta;" : 950,
    "eta;" : 951,
    "theta;" : 952,
    "iota;" : 953,
    "kappa;" : 954,
    "lambda;" : 955,
    "mu;" : 956,
    "nu;" : 957,
    "xi;" : 958,
    "omicron;" : 959,
    "pi;" : 960,
    "rho;" : 961,
    "sigmaf;" : 962,
    "sigma;" : 963,
    "tau;" : 964,
    "upsilon;" : 965,
    "phi;" : 966,
    "chi;" : 967,
    "psi;" : 968,
    "omega;" : 969,
    "thetasym;" : 977,
    "upsih;" : 978,
    "piv;" : 982,
    "ensp;" : 8194,
    "emsp;" : 8195,
    "thinsp;" : 8201,
    "zwnj;" : 8204,
    "zwj;" : 8205,
    "lrm;" : 8206,
    "rlm;" : 8207,
    "ndash;" : 8211,
    "mdash;" : 8212,
    "lsquo;" : 8216,
    "rsquo;" : 8217,
    "sbquo;" : 8218,
    "ldquo;" : 8220,
    "rdquo;" : 8221,
    "bdquo;" : 8222,
    "dagger;" : 8224,
    "Dagger;" : 8225,
    "bull;" : 8226,
    "hellip;" : 8230,
    "permil;" : 8240,
    "prime;" : 8242,
    "Prime;" : 8243,
    "lsaquo;" : 8249,
    "rsaquo;" : 8250,
    "oline;" : 8254,
    "frasl;" : 8260,
    "euro;" : 8364,
    "image;" : 8465,
    "weierp;" : 8472,
    "real;" : 8476,
    "trade;" : 8482,
    "alefsym;" : 8501,
    "larr;" : 8592,
    "uarr;" : 8593,
    "rarr;" : 8594,
    "darr;" : 8595,
    "harr;" : 8596,
    "crarr;" : 8629,
    "lArr;" : 8656,
    "uArr;" : 8657,
    "rArr;" : 8658,
    "dArr;" : 8659,
    "hArr;" : 8660,
    "forall;" : 8704,
    "part;" : 8706,
    "exist;" : 8707,
    "empty;" : 8709,
    "nabla;" : 8711,
    "isin;" : 8712,
    "notin;" : 8713,
    "ni;" : 8715,
    "prod;" : 8719,
    "sum;" : 8721,
    "minus;" : 8722,
    "lowast;" : 8727,
    "radic;" : 8730,
    "prop;" : 8733,
    "infin;" : 8734,
    "ang;" : 8736,
    "and;" : 8743,
    "or;" : 8744,
    "cap;" : 8745,
    "cup;" : 8746,
    "int;" : 8747,
    "there4;" : 8756,
    "sim;" : 8764,
    "cong;" : 8773,
    "asymp;" : 8776,
    "ne;" : 8800,
    "equiv;" : 8801,
    "le;" : 8804,
    "ge;" : 8805,
    "sub;" : 8834,
    "sup;" : 8835,
    "nsub;" : 8836,
    "sube;" : 8838,
    "supe;" : 8839,
    "oplus;" : 8853,
    "otimes;" : 8855,
    "perp;" : 8869,
    "sdot;" : 8901,
    "lceil;" : 8968,
    "rceil;" : 8969,
    "lfloor;" : 8970,
    "rfloor;" : 8971,
    "lang;" : 9001,
    "rang;" : 9002,
    "loz;" : 9674,
    "spades;" : 9824,
    "clubs;" : 9827,
    "hearts;" : 9829,
    "diams;" : 9830
  }


}).call(this);

},{}]},{},[42]);
