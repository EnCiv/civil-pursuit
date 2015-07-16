'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var _componentsYoutubeView = require('../../../components/youtube/view');

var _componentsYoutubeView2 = _interopRequireDefault(_componentsYoutubeView);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _promote = require('./promote');

var _promote2 = _interopRequireDefault(_promote);

var _details = require('./details');

var _details2 = _interopRequireDefault(_details);

var _libUtilCloudinaryFormat = require('../../../lib/util/cloudinary-format');

var _libUtilCloudinaryFormat2 = _interopRequireDefault(_libUtilCloudinaryFormat);

var Item = (function (_Milk) {
  function Item(props) {
    var _this = this;

    _classCallCheck(this, Item);

    props = props || {};

    console.log();
    console.log();
    console.log();
    console.log();
    console.log('Item props', props);
    console.log();
    console.log();
    console.log();
    console.log();

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, 'Item', options);

    this.props = props || {};

    var get = this.get.bind(this);
    var find = this.find.bind(this);

    var item = this.props.item;

    var itemIsAnObject = typeof item === 'object';
    var itemIsASelector = typeof item === 'string';

    var useDefaultButtons = this.props.button;

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.set('Join', function () {
      return _this.find(_join2['default'].find('main'));
    });

    this.set('Cookie', function () {
      return _this.getCookie('synuser');
    });

    if (props.element) {
      this.set('Item', function () {
        return props.element;
      }, null, props.element);
    } else {
      this.set('Item', function () {
        return find('#item-' + item._id);
      }, null, function () {
        return itemIsAnObject;
      }).set('Item', function () {
        return find(item);
      }, null, function () {
        return itemIsASelector;
      });
    }

    this.set('Media Wrapper', function () {
      return _this.find(get('Item').selector + '>.item-media-wrapper');
    }).set('Media', function () {
      return _this.find(get('Media Wrapper').selector + '>.item-media');
    }).set('Image', function () {
      return _this.find(get('Media').selector + ' img.img-responsive');
    }).set('Video Container', function () {
      return _this.find(get('Media Wrapper').selector + ' .video-container');
    }).set('Iframe', function () {
      return _this.find(get('Video Container').selector + ' iframe');
    }).set('Buttons', function () {
      return _this.find(get('Item').selector + '>.item-buttons');
    }).set('Text', function () {
      return _this.find(get('Item').selector + '>.item-text');
    }).set('Truncatable', function () {
      return _this.find(get('Text').selector + '>.item-truncatable');
    }).set('Subject', function () {
      return _this.find(get('Text').selector + ' h4.item-subject.header');
    }).set('Description', function () {
      return _this.find(get('Text').selector + ' .item-description.pre-text');
    }).set('Reference', function () {
      return _this.find(get('Text').selector + ' .item-reference a');
    }).set('Toggle promote', function () {
      return _this.find(get('Buttons').selector + ' button.item-toggle-promote');
    }).set('Toggle details', function () {
      return _this.find(get('Buttons').selector + ' .item-toggle-details');
    }).set('Related', function () {
      return _this.find(get('Buttons').selector + ' span.related-number');
    }).set('Harmony', function () {
      return _this.find(get('Buttons').selector + ' span.harmony-number');
    }).set('Collapsers', function () {
      return _this.find(get('Item').selector + '>.item-collapsers');
    });

    // Visibility

    this.ok(function () {
      return get('Item').is(':visible');
    }, 'Item is visible').ok(function () {
      return get('Item').is('.item');
    }, 'Item has the class ".visible"').ok(function () {
      return get('Media Wrapper').is(':visible');
    }, 'Item Media Wrapper is visible').ok(function () {
      return get('Media').is(':visible');
    }, 'Item Media is visible').ok(function () {
      return get('Text').is(':visible');
    }, 'Item Text is visible');

    if (itemIsAnObject && _componentsYoutubeView2['default'].isYouTube(item)) {
      this.ok(function () {
        return get('Video Container').is(':visible');
      }, 'Item Video Container is visible').wait(1).ok(function () {
        return get('Iframe').is(':visible');
      }, 'Item YouTube Iframe is visible').ok(function () {
        return get('Iframe').width().then(function (width) {
          return width.should.be.within(183, 186);
        });
      }, 'Iframe should be the exact width').ok(function () {
        return get('Iframe').height().then(function (height) {
          return height.should.be.within(133, 135);
        });
      }, 'Iframe should be the exact height');
    } else if (itemIsAnObject) {
      this.ok(function () {
        return get('Image').is(':visible');
      }, 'Item Image is visible').ok(function () {
        return get('Image').width().then(function (width) {
          return width.should.be.within(183, 186);
        });
      }, 'Item image has the right width').ok(function () {
        return get('Image').height().then(function (height) {
          return height.should.be.within(100, 150);
        });
      }, 'Item image has the right height');

      if (item.image) {
        this.ok(function () {
          return get('Image').attr('src').then(function (src) {
            return src.should.be.exactly((0, _libUtilCloudinaryFormat2['default'])(item.image));
          });
        }, 'Item Image is the same than in DB');
      } else {
        this.ok(function () {
          return get('Image').attr('src').then(function (src) {
            return src.should.be.exactly(_configJson2['default']['public']['default item image']);
          });
        }, 'Item Image is the default image');
      }
    }

    if (itemIsAnObject) {

      // VERIFY TEXT

      this.ok(function () {
        return get('Truncatable').is(':visible');
      }, 'Item Truncatable space is visible').ok(function () {
        return get('Subject').is(':visible');
      }, 'Item subject is visible').ok(function () {
        return get('Subject').text().then(function (text) {
          return text.should.be.exactly(item.subject);
        });
      }, 'Subject has the same text than DB').ok(function () {
        return Promise.all([get('Truncatable').count('.more'), get('Description').text()]).then(function (results) {
          var more = results[0];
          var text = results[1];

          if (!more) {
            text.should.be.exactly(_libAppMilk2['default'].formatToHTMLText(item.description));
          }
        });
      }, 'Item Description is the same than in DB');

      // REFERENCES

      this.ok(function () {
        return get('Reference').text().then(function (text) {
          if (itemIsAnObject) {
            var ref = item.references.length ? item.references[0] : null;

            if (ref) {
              if (ref.title) {
                text.should.be.exactly(ref.title);
              } else {
                text.should.be.exactly(ref.url);
              }
            } else {
              text.should.be.exactly('');
            }
          }
        });
      }, 'Verify reference', function () {
        return props.references !== false;
      });

      // BUTTONS

      if (props.buttons !== false) {
        this.ok(function () {
          return get('Buttons').is(':visible');
        }, 'Item Buttons are visible');

        // PROMOTE
        this.ok(function () {
          return get('Toggle promote').is(':visible');
        }, 'Promote toggle button is visible').ok(function () {
          return get('Toggle promote').text().then(function (text) {
            return (+text).should.be.exactly(item.promotions);
          });
        }, 'Promote toggle button text is the right amount of times item has been promoted');

        // DETAILS
        this.ok(function () {
          return get('Toggle details').is(':visible');
        }, 'Details toggle button is visible').ok(function () {
          return get('Toggle details').text().then(function (text) {
            return text.should.be.exactly(item.popularity.number.toString() + '%');
          });
        }, 'Deatisl toggle button text is item\'s popularity');

        // RELATED
        this.ok(function () {
          return get('Related').is(':visible');
        }, 'Related buttons is visible').ok(function () {
          return get('Related').text().then(function (text) {
            (+text).should.be.exactly(item.children);
          });
        }, 'Related button text is the number of direct children');

        // HARMONY
        this.ok(function () {
          return get('Harmony').is(':visible');
        }, 'Harmony buttons is visible').ok(function () {
          return get('Harmony').text().then(function (text) {
            (+text).should.be.exactly(item.harmony);
          });
        }, 'Harmony button text is the number of direct children');
      }
    }

    // COLLAPSERS

    if (this.props.collapsers !== false && item.collapsers !== false) {
      this.ok(function () {
        return get('Collapsers').is(true);
      }, 'Collapsers are hidden');
    }

    // PROMOTE

    if (this.props.promote !== false && item.promote !== false) {

      // NO COOKIE

      this.ok(function () {
        return get('Toggle promote').click();
      }, 'Clicking on Promote toggle buttons should show Join', function (when) {
        return !get('Cookie');
      }).wait(1, null, function (when) {
        return !get('Cookie');
      }).ok(function () {
        return get('Join').is(true);
      }, null, function (when) {
        return !get('Cookie');
      }).ok(function () {
        return get('Toggle promote').click();
      }, 'Clicking on Promote toggle buttons should show Join', function (when) {
        return !get('Cookie');
      }).wait(2, null, function (when) {
        return !get('Cookie');
      }).ok(function () {
        return get('Join').is(false);
      }, null, function (when) {
        return !get('Cookie');
      });

      // COOKIE

      // Don't click because components like Creator have already shown Promote when new item was created
      if (this.props.promote !== true) {
        this.ok(function () {
          return get('Toggle promote').click();
        }, 'Clicking on Promote toggle buttons should show Promote', function (when) {
          return get('Cookie');
        });
      }

      this.wait(1, null, function (when) {
        return get('Cookie');
      })

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      ['import'](_promote2['default'], {
        item: item,
        viewport: options.viewport
      }, 'Launch Promote test if User is signed in', function (when) {
        return get('Cookie');
      })

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .ok(function () {
        return get('Toggle promote').click();
      }, 'Clicking on Promote toggle buttons should show Promote (if User is signed in)', function (when) {
        return get('Cookie');
      })

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .wait(2, 'Wait 2 seconds for Promote screen to hide (if User is signed in)', function (when) {
        return get('Cookie');
      });
    }

    // DETAILS

    if (this.props.details !== false && item.details !== false) {

      this.ok(function () {
        return get('Toggle details').click();
      }, 'Clicking on Details toggle buttons').wait(2)['import'](_details2['default'], { item: item, viewport: options.viewport }).ok(function () {
        return get('Toggle details').click();
      }, 'Clicking on Details toggle button').wait(1);
    }
  }

  _inherits(Item, _Milk);

  return Item;
})(_libAppMilk2['default']);

exports['default'] = Item;
module.exports = exports['default'];