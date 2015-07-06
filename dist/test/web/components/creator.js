'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _modelsItem = require('../../../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _libAppGetUrlTitle = require('../../../lib/app/get-url-title');

var _libAppGetUrlTitle2 = _interopRequireDefault(_libAppGetUrlTitle);

var Creator = (function (_Milk) {
  function Creator(props) {
    var _this = this;

    _classCallCheck(this, Creator);

    props = props || {};

    var options = { viewport: props.viewport, session: props.session };

    _get(Object.getPrototypeOf(Creator.prototype), 'constructor', this).call(this, 'Creator', options);

    this.props = props || {};

    var get = this.get.bind(this);
    var find = this.find.bind(this);

    if (this.props.driver !== false) {
      this.go('/');
    }

    if (!this.props.panel) {
      this.props.panel = find('.panels > .panel');
      this.wait(2);
      this.ok(function () {
        return find('.panels > .panel > .panel-heading .toggle-creator').click();
      }, 'Click on Creator Toggle');
      this.wait(2);
    }

    var Item = undefined;

    // Get cookie

    this.set('Cookie', function () {
      return _this.getCookie('synuser');
    });

    // DOM selectors

    this.set('Panel', function () {
      return _this.props.panel;
    });

    this.set('Creator', function () {
      return find(get('Panel').selector + ' > .panel-body > form.creator');
    });

    this.set('Item', function () {
      return find(get('Creator').selector + ' > .is-section > .item');
    });

    this.set('Create', function () {
      return find(get('Item').selector + ' .button-create');
    });

    this.set('Subject', function () {
      return find(get('Creator').selector + ' input[name="subject"]');
    });

    this.set('Description', function () {
      return find(get('Creator').selector + ' textarea[name="description"]');
    });

    this.set('Reference', function () {
      return find(get('Creator').selector + ' input[name="reference"]');
    });

    this.set('Reference board', function () {
      return find(get('Creator').selector + ' .reference-board');
    });

    this.set('New item', function () {
      return find(get('Panel').selector + ' > .panel-body > .items .item.new');
    });

    this.set('Input file', function () {
      return find(get('Creator').selector + ' input[type="file"][name="image"]');
    });

    this.set('Choose file', function () {
      return find(get('Creator').selector + ' button.upload-image-button');
    });

    this.set('Uploaded image', function () {
      return find(get('Creator').selector + ' .drop-box .preview-image');
    });

    // Visibility

    this.ok(function () {
      return get('Creator').is(':visible');
    }, 'Creator is visible');
    this.ok(function () {
      return get('Creator').is('.is-shown');
    }, 'Creator has class "is-shown", meaning it has been expanded successfully by our navigation system');
    this.ok(function () {
      return get('Create').is(':visible');
    }, 'Create button is visible');

    // Form should be empty

    this.ok(function () {
      return get('Subject').val().then(function (val) {
        return val.should.be.exactly('');
      });
    }, 'Subject should be empty');

    // Item

    this['import'](_item2['default'], function () {
      return {
        item: get('Item').selector,
        buttons: false,
        collapsers: false,
        promote: false,
        details: false,
        references: false
      };
    });

    // Validations

    this.ok(function () {
      return get('Create').click();
    }, 'Click on Create button');

    this.wait(0.5);

    this.ok(function () {
      return get('Subject').is('.error');
    }, 'Subject field is showing error because it is empty');

    this.ok(function () {
      return get('Subject').val('This is a subject');
    }, 'Writing a subject');

    this.ok(function () {
      return get('Create').click();
    }, 'Click on Create button');

    this.wait(0.5);

    this.ok(function () {
      return get('Subject').not('.error');
    }, 'Subject field is showing error because it is empty');

    this.ok(function () {
      return get('Description').is('.error');
    }, 'Description field is showing error because it is empty');

    this.ok(function () {
      return get('Description').val('This is a description created ' + new Date());
    }, 'Writing a description');

    // Upload

    if (this.props.upload) {
      this.set('Test image', function () {
        return new Promise(function (ok, ko) {
          (0, _request2['default'])(_configJson2['default']['example image for test upload']).on('error', ko).on('end', ok).pipe(_fs2['default'].createWriteStream('/tmp/test-upload.jpg'));
        });
      });

      // this.ok(() => get('Input file').val('/tmp/test-upload.jpg'));
      this.ok(function () {
        return get('Input file').val('/home/francois/Pictures/jpb.jpg');
      });

      this.wait(3);

      this.ok(function () {
        return get('Uploaded image').is(':visible');
      });

      this.ok(function () {
        return get('Uploaded image').attr('src').then(function (src) {
          return src.should.startWith('blob:');
        });
      });
    }

    // Reference

    this.references();

    // Submit with all required fields

    this.ok(function () {
      return get('Create').click();
    }, 'Click on Create button');

    this.wait(0.5);

    this.ok(function () {
      return get('Subject').not('.error');
    }, 'Subject field is showing error because it is empty');

    this.ok(function () {
      return get('Description').not('.error');
    }, 'Description field is showing error because it is empty');

    // New item is an item

    this.wait(2.5);

    this.ok(function () {
      return get('New item').is(':visible');
    }, 'Newly created item has appeared on the items list of the panel the creator belongs to');

    this.ok(function () {
      return new Promise(function (ok, ko) {

        get('New item').attr('id').then(function (id) {
          try {
            console.log('got new item id', id);
            if (Array.isArray(id)) {
              id = id[0];
            }
            _modelsItem2['default'].findById(id.split('-')[1]).exec().then(function (item) {
              try {
                if (!item) {
                  return ko(new Error('New item not found in DB'));
                }
                item.toPanelItem().then(function (item) {
                  Item = item;
                  ok();
                }, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          } catch (error) {
            ko(error);
          }
        }, ko);
      });
    }, 'Get new item from DB');

    this['import'](_item2['default'], function () {
      return { item: Item, promote: true, viewport: _this.props.viewport };
    });
  }

  _inherits(Creator, _Milk);

  _createClass(Creator, [{
    key: 'references',
    value: function references(i) {
      var _this2 = this;

      i = i || 0;

      var urls = ['http://example.com', 'http://synaccord.com', 'http://isup.me/http://synaccord.com'];

      if (i < urls.length) {
        this.set('Title', function () {
          return (0, _libAppGetUrlTitle2['default'])(urls[i]);
        });

        this.ok(function () {
          return _this2.get('Reference').val(urls[i] + '');
        }, 'Entering URL');

        this.wait(1);

        this.ok(function () {
          return _this2.get('Reference board').is(':visible');
        }, 'Reference board is visible');

        this.ok(function () {
          return _this2.get('Reference board').text().then(function (text) {
            try {
              text.should.be.exactly('Looking up title');
            } catch (error) {
              text.should.be.exactly(_this2.get('Title'));
            }
          });
        }, 'Reference board is showing loading message or response');

        this.wait(5);

        this.ok(function () {
          return _this2.get('Reference board').text().then(function (text) {
            return text.should.be.exactly(_this2.get('Title'));
          });
        }, 'Reference board shows title');
      }
    }
  }]);

  return Creator;
})(_libAppMilk2['default']);

exports['default'] = Creator;
module.exports = exports['default'];