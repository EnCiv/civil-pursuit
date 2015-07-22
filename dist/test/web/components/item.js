'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var _modelsItem = require('../../../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var Item = (function (_Milk) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Item(props) {
    _classCallCheck(this, Item);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, 'Item', options);

    console.log('props', props);

    this.props = props;
    this.options = options;

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.actors();

    this.stories();
  }

  _inherits(Item, _Milk);

  _createClass(Item, [{
    key: 'actors',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function actors() {
      var _this = this;

      this.set('Join', function () {
        return _this.find(_join2['default'].find('main'));
      }).set('Cookie', function () {
        return _this.getCookie('synuser');
      }).set('View', function () {
        return _this.find(_this.props.item.selector);
      }, null, function () {
        return _this.props.item.selector;
      }).set('View', function () {
        return _this.find('#item-' + _this.props.item.document._id);
      }, null, function () {
        return _this.props.item.document;
      }).set('Document', this.props.item.document, null, function () {
        return _this.props.item.document;
      }).set('Document', this.getDocumentFromId.bind(this), null, function () {
        return !_this.props.item.document;
      }).set('Media Wrapper', function () {
        return _this.find(_this.get('View').selector + '>.item-media-wrapper');
      }).set('Media', function () {
        return _this.find(_this.get('Media Wrapper').selector + '>.item-media');
      }).set('Image', function () {
        return _this.find(_this.get('Media').selector + ' img.img-responsive');
      }).set('Video Container', function () {
        return _this.find(_this.get('Media Wrapper').selector + ' .video-container');
      }).set('Iframe', function () {
        return _this.find(_this.get('Video Container').selector + ' iframe');
      }).set('Buttons', function () {
        return _this.find(_this.get('View').selector + '>.item-buttons');
      }).set('Text', function () {
        return _this.find(_this.get('View').selector + '>.item-text');
      }).set('Truncatable', function () {
        return _this.find(_this.get('Text').selector + '>.item-truncatable');
      }).set('Subject', function () {
        return _this.find(_this.get('Text').selector + ' h4.item-subject.header');
      }).set('Description', function () {
        return _this.find(_this.get('Text').selector + ' .item-description.pre-text');
      }).set('Reference', function () {
        return _this.find(_this.get('Text').selector + ' .item-reference a');
      }).set('Toggle promote', function () {
        return _this.find(_this.get('Buttons').selector + ' button.item-toggle-promote');
      }).set('Toggle details', function () {
        return _this.find(_this.get('Buttons').selector + ' .item-toggle-details');
      }).set('Related', function () {
        return _this.find(_this.get('Buttons').selector + ' span.related-number');
      }).set('Harmony', function () {
        return _this.find(_this.get('Buttons').selector + ' span.harmony-number');
      }).set('Collapsers', function () {
        return _this.find(_this.get('View').selector + '>.item-collapsers');
      }).set('Children', function () {
        return _this.find(_this.get('Collapsers').selector + '>.children');
      }).set('Child Panel Harmony Left', function () {

        var selector = _this.get('Children').selector;

        selector += ' .tablet-50.left-split .panel.split-view#panel-';

        selector += _this.get('Document').type.harmony[0]._id + '-';

        selector += _this.get('Document')._id;

        return _this.find(selector);
      }, 'Child Panel Harmony Left', function () {
        return _this.get('Document') && _this.get('Document').type.harmony[0];
      });
    }
  }, {
    key: 'stories',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function stories() {
      var _this2 = this;

      // Visibility

      this.ok(function () {
        return _this2.get('View').is(':visible');
      }, 'Item is visible').ok(function () {
        return _this2.get('View').is('.item');
      }, 'Item has the class ".visible"').ok(function () {
        return _this2.get('Media Wrapper').is(':visible');
      }, 'Item Media Wrapper is visible').ok(function () {
        return _this2.get('Media').is(':visible');
      }, 'Item Media is visible').ok(function () {
        return _this2.get('Text').is(':visible');
      }, 'Item Text is visible');

      // Media

      this.media();

      // VERIFY TEXT

      this.text();

      // BUTTONS

      this.buttons();

      // COLLAPSERS

      this.collapsers();

      // PROMOTE

      this.promote();

      // DETAILS

      this.details();
    }
  }, {
    key: 'media',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function media() {
      this.youTube();

      this.image();
    }
  }, {
    key: 'youTube',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function youTube() {
      var _this3 = this;

      var condition = function condition() {
        return _this3.get('Document') && _componentsYoutubeView2['default'].isYouTube(_this3.get('Document'));
      };

      this.ok(function () {
        return _this3.get('Video Container').is(':visible');
      }, 'Item Video Container is visible', condition).wait(1, null, condition).ok(function () {
        return _this3.get('Iframe').is(':visible');
      }, 'Item YouTube Iframe is visible', condition).ok(function () {
        return _this3.get('Iframe').width().then(function (width) {
          return width.should.be.within(183, 186);
        });
      }, 'Iframe should be the exact width', condition).ok(function () {
        return _this3.get('Iframe').height().then(function (height) {
          return height.should.be.within(133, 135);
        });
      }, 'Iframe should be the exact height', condition);
    }
  }, {
    key: 'image',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function image() {
      var _this4 = this;

      var condition = function condition() {
        return _this4.get('Document') && !_componentsYoutubeView2['default'].isYouTube(_this4.get('Document'));
      };

      var conditionHasImage = function conditionHasImage() {
        return _this4.get('Document') && !_componentsYoutubeView2['default'].isYouTube(_this4.get('Document')) && _this4.get('Document').image;
      };

      var conditionDoesNotHaveImage = function conditionDoesNotHaveImage() {
        return _this4.get('Document') && !_componentsYoutubeView2['default'].isYouTube(_this4.get('Document')) && !_this4.get('Document').image;
      };

      this.ok(function () {
        return _this4.get('Image').is(':visible');
      }, 'Item Image is visible', condition).ok(function () {
        return _this4.get('Image').width().then(function (width) {
          return width.should.be.within(183, 186);
        });
      }, 'Item image has the right width', condition).ok(function () {
        return _this4.get('Image').height().then(function (height) {
          return height.should.be.within(100, 150);
        });
      }, 'Item image has the right height', condition).ok(function () {
        return _this4.get('Image').attr('src').then(function (src) {
          return src.should.be.exactly((0, _libUtilCloudinaryFormat2['default'])(_this4.get('Document').image));
        });
      }, 'Item Image is the same than in DB', conditionHasImage).ok(function () {
        return _this4.get('Image').attr('src').then(function (src) {
          return src.should.be.exactly(_configJson2['default']['public']['default item image']);
        });
      }, 'Item Image is the default image', conditionDoesNotHaveImage);
    }
  }, {
    key: 'text',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function text() {
      var _this5 = this;

      this.ok(function () {
        return _this5.get('Truncatable').is(':visible');
      }, 'Item Truncatable space is visible', function () {
        return _this5.get('Document');
      }).ok(function () {
        return _this5.get('Subject').is(':visible');
      }, 'Item subject is visible', function () {
        return _this5.get('Document');
      }).ok(function () {
        return _this5.get('Subject').text().then(function (text) {
          return text.should.be.exactly(_this5.get('Document').subject);
        });
      }, 'Subject has the same text than DB', function () {
        return _this5.get('Document');
      }).ok(function () {
        return Promise.all([_this5.get('Truncatable').count('.more'), _this5.get('Description').text()]).then(function (results) {
          var more = results[0];
          var text = results[1];

          if (!more) {
            text.should.be.exactly(_libAppMilk2['default'].formatToHTMLText(_this5.get('Document').description));
          }
        });
      }, 'Item Description is the same than in DB', function () {
        return _this5.get('Document');
      });

      // REFERENCES

      this.ok(function () {
        return _this5.get('Reference').text().then(function (text) {
          var ref = _this5.get('Document').references.length ? _this5.get('Document').references[0] : null;

          if (ref) {
            if (ref.title) {
              text.should.be.exactly(ref.title);
            } else {
              text.should.be.exactly(ref.url);
            }
          } else {
            text.should.be.exactly('');
          }
        });
      }, 'Verify reference', function () {
        return _this5.props.references !== false && _this5.get('Document');
      });
    }
  }, {
    key: 'buttons',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function buttons() {
      var _this6 = this;

      if (this.props.buttons !== false) {
        this.ok(function () {
          return _this6.get('Buttons').is(':visible');
        }, 'Item Buttons are visible');

        // PROMOTE
        this.ok(function () {
          return _this6.get('Toggle promote').is(':visible');
        }, 'Promote toggle button is visible').ok(function () {
          return _this6.get('Toggle promote').text().then(function (text) {
            return (+text).should.be.exactly(_this6.get('Document').promotions);
          });
        }, 'Promote toggle button text is the right amount of times item has been promoted');

        // DETAILS
        this.ok(function () {
          return _this6.get('Toggle details').is(':visible');
        }, 'Details toggle button is visible').ok(function () {
          return _this6.get('Toggle details').text().then(function (text) {
            return text.should.be.exactly(_this6.get('Document').popularity.number.toString() + '%');
          });
        }, 'Deatisl toggle button text is item\'s popularity');

        // RELATED
        this.ok(function () {
          return _this6.get('Related').is(':visible');
        }, 'Related buttons is visible').ok(function () {
          return _this6.get('Related').text().then(function (text) {
            (+text).should.be.exactly(_this6.get('Document').children);
          });
        }, 'Related button text is the number of direct children');

        // HARMONY
        this.ok(function () {
          return _this6.get('Harmony').is(':visible');
        }, 'Harmony buttons is visible').ok(function () {
          return _this6.get('Harmony').text().then(function (text) {
            (+text).should.be.exactly(_this6.get('Document').harmony);
          });
        }, 'Harmony button text is the number of direct children');
      }
    }
  }, {
    key: 'collapsers',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function collapsers() {
      var _this7 = this;

      if (this.props.collapsers === false) {
        return false;
      }

      this.ok(function () {
        return _this7.get('Collapsers').is(true);
      }, 'Collapsers are hidden');

      // .ok(
      //   () => this.get('Child Panel Harmony Left').is(':visible'),
      //   'Left harmony children panel is visible',
      //   () => this.get('Document').type.harmony.length
      // );
    }
  }, {
    key: 'promote',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function promote() {
      var _this8 = this;

      if (this.props.promote !== false) {

        // NO COOKIE

        this.ok(function () {
          return _this8.get('Toggle promote').click();
        }, 'Clicking on Promote toggle buttons should show Join', function (when) {
          return !_this8.get('Cookie');
        }).wait(1, null, function (when) {
          return !_this8.get('Cookie');
        }).ok(function () {
          return _this8.get('Join').is(true);
        }, 'Join Panel should be visible', function (when) {
          return !_this8.get('Cookie');
        }).ok(function () {
          return _this8.get('Toggle promote').click();
        }, 'Clicking on Promote toggle buttons should hide Join', function (when) {
          return !_this8.get('Cookie');
        }).wait(2, null, function (when) {
          return !_this8.get('Cookie');
        }).ok(function () {
          return _this8.get('Join').is(false);
        }, 'Join Panel should be removed', function (when) {
          return !_this8.get('Cookie');
        });

        // COOKIE

        // Don't click because components like Creator have already shown Promote when new item was created
        if (this.props.promote !== true) {
          this.ok(function () {
            return _this8.get('Toggle promote').click();
          }, 'Clicking on Promote toggle buttons should show Promote', function (when) {
            return _this8.get('Cookie');
          });
        }

        this.wait(1, null, function (when) {
          return _this8.get('Cookie');
        })

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        ['import'](_promote2['default'], {
          item: {
            Document: function Document() {
              return _this8.get('Document');
            },
            View: function View() {
              return _this8.get('View');
            }
          },
          viewport: this.options.viewport
        }, 'Launch Promote test if User is signed in', function (when) {
          return _this8.get('Cookie');
        })

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        .ok(function () {
          return _this8.get('Toggle promote').click();
        }, 'Clicking on Promote toggle buttons should show Promote (if User is signed in)', function (when) {
          return _this8.get('Cookie');
        })

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        .wait(2, 'Wait 2 seconds for Promote screen to hide (if User is signed in)', function (when) {
          return _this8.get('Cookie');
        });
      }
    }
  }, {
    key: 'details',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function details() {
      var _this9 = this;

      if (this.props.details !== false) {

        this.ok(function () {
          return _this9.get('Toggle details').click();
        }, 'Clicking on Details toggle buttons').wait(2)['import'](_details2['default'], { item: this.get('Document'), viewport: this.options.viewport }).ok(function () {
          return _this9.get('Toggle details').click();
        }, 'Clicking on Details toggle button').wait(1);
      }
    }
  }, {
    key: 'getDocumentFromId',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function getDocumentFromId() {
      var _this10 = this;

      return new Promise(function (ok, ko) {
        try {
          _this10.get('View').attr('id').then(function (id) {
            try {
              var _ret = (function () {
                var itemId = id.split('-')[1];

                if (itemId === 'undefined') {
                  return {
                    v: ok(null)
                  };
                }

                _modelsItem2['default'].findById(itemId).exec().then(function (item) {
                  try {
                    if (!item) {
                      throw new Error('Item not found: ' + itemId);
                    }
                    ok(item);
                  } catch (error) {
                    ko(error);
                  }
                }, ko);
              })();

              if (typeof _ret === 'object') return _ret.v;
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Item;
})(_libAppMilk2['default']);

exports['default'] = Item;
module.exports = exports['default'];