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

var _modelsItem = require('../../../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _libUtilCloudinaryFormat = require('../../../lib/util/cloudinary-format');

var _libUtilCloudinaryFormat2 = _interopRequireDefault(_libUtilCloudinaryFormat);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsYoutubeView = require('../../../components/youtube/view');

var _componentsYoutubeView2 = _interopRequireDefault(_componentsYoutubeView);

var Promote = (function (_Milk) {
  function Promote(props) {
    _classCallCheck(this, Promote);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, 'Promote', options);

    this.props = props;

    this.item = this.props.item;

    this.isYouTube = this.item && this.item.references.length && _componentsYoutubeView2['default'].regex.test(this.item.references[0].url);

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.actors();
    this.stories();
  }

  _inherits(Promote, _Milk);

  _createClass(Promote, [{
    key: 'actors',
    value: function actors() {
      var _this = this;

      var set = this.set.bind(this);
      var get = this.get.bind(this);
      var find = this.find.bind(this);

      // Item View

      set('Item', function () {
        return find('#item-' + _this.item._id);
      });

      // Cookie

      set('Cookie', function () {
        return _this.getCookie('synuser');
      });

      // Evaluation -- won't be the same than in Browser since evaluation are random, but like this we get the numbers of items in an evaluation - it should be 6 but it can be less -- also like this we get criterias

      set('Evaluation', function () {
        return _modelsItem2['default'].evaluate(get('Cookie').id, _this.item._id);
      });

      set('Main', function () {
        return find(get('Item').selector + ' > .item-collapsers > .promote');
      });

      set('Header', function () {
        return find(get('Main').selector + ' header.promote-steps');
      });

      set('Cursor', function () {
        return find(get('Header').selector + ' .cursor');
      });

      set('Limit', function () {
        return find(get('Header').selector + ' .limit');
      });

      set('Side by side', function () {
        return find(get('Main').selector + ' .items-side-by-side');
      });

      // VIEWPORT VIEW

      switch (this.props.viewport) {
        case 'tablet':
          set('View', function () {
            return find(get('Side by side').selector + ' .split-hide-down');
          });
          break;
      }

      set('Left image', function () {
        return find(get('View').selector + ' .left-item.image img.img-responsive');
      });

      set('Right image', function () {
        return find(get('View').selector + ' .right-item.image img.img-responsive');
      });

      set('Left video', function () {
        return find(get('View').selector + ' .left-item.image .video-container iframe');
      });

      set('Right video', function () {
        return find(get('View').selector + ' .right-item.image .video-container iframe');
      });

      set('Left subject', function () {
        return find(get('View').selector + ' .left-item.subject h4');
      });

      set('Right subject', function () {
        return find(get('View').selector + ' .right-item.subject h4');
      });

      set('Left description', function () {
        return find(get('View').selector + ' .left-item.description');
      });

      set('Right description', function () {
        return find(get('View').selector + ' .right-item.description');
      });

      set('Left reference', function () {
        return find(get('View').selector + ' .left-item.references a');
      });

      set('Right reference', function () {
        return find(get('View').selector + ' .right-item.references a');
      });

      set('Left criteria', function () {
        return find(get('View').selector + ' .left-item.sliders .criteria-name');
      });

      set('Right criteria', function () {
        return find(get('View').selector + ' .right-item.sliders .criteria-name');
      });

      var _loop = function (i) {
        set('Left criteria name #' + i, function () {
          return find(get('View').selector + ' .left-item.sliders .criteria-' + i + ' .criteria-name');
        });

        set('Left criteria description #' + i, function () {
          return find(get('View').selector + ' .left-item.sliders .criteria-' + i + ' .criteria-description');
        });
      };

      for (var i = 0; i < 4; i++) {
        _loop(i);
      }

      var _loop2 = function (i) {
        set('Right criteria name #' + i, function () {
          return find(get('View').selector + ' .right-item.sliders .criteria-' + i + ' .criteria-name');
        });

        set('Right criteria description #' + i, function () {
          return find(get('View').selector + ' .right-item.sliders .criteria-' + i + ' .criteria-description');
        });
      };

      for (var i = 0; i < 4; i++) {
        _loop2(i);
      }

      set('Left feedback', function () {
        return find(get('View').selector + ' .left-item.feedback textarea.feedback-entry');
      });
    }
  }, {
    key: 'stories',
    value: function stories() {
      var _this2 = this;

      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);
      var find = this.find.bind(this);

      ok(function () {
        return get('Item').is(':visible');
      }, 'Item is visible');
      ok(function () {
        return get('Main').is(':visible');
      }, 'Promote is visible');
      ok(function () {
        return get('Header').is(':visible');
      }, 'Header is visible');
      ok(function () {
        return get('Cursor').is(':visible');
      }, 'Cursor is visible');

      ok(function () {
        return get('Cursor').text().then(function (text) {
          return text.should.be.exactly('1');
        });
      }, 'Cursor shows the right number');

      ok(function () {
        return get('Limit').text().then(function (text) {
          return (+text.trim()).should.be.exactly(get('Evaluation').items.length - 1);
        });
      }, 'Limit shows the right number');

      set('Limit', function () {
        return get('Limit').text();
      });

      // SIDE BY SIDE

      ok(function () {
        return get('Side by side').is(':visible');
      }, 'Side by side is visible');

      ok(function () {
        return get('View').is(':visible');
      }, 'Side by side viewport view is visible');

      // Get left item's id

      ok(function () {
        return get('Side by side').attr('data-left-item').then(function (attr) {
          return _this2.leftSide(attr);
        });
      }, 'Verify left item');

      ok(function () {
        return get('Side by side').attr('data-right-item').then(function (attr) {
          return _this2.rightSide(attr);
        });
      }, 'Verify right item');
    }
  }, {
    key: 'leftSide',
    value: function leftSide(id) {
      var _this3 = this;

      console.log('left side', id);
      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);
      var find = this.find.bind(this);

      set('Left item', function () {
        return _modelsItem2['default'].findById(id).exec();
      });

      // Left image is item's image

      ok(function () {
        return get('Left image').attr('src').then(function (src) {
          return src.should.be.exactly((0, _libUtilCloudinaryFormat2['default'])(get('Left item').image));
        });
      }, 'Left image', function () {
        return get('Left item').image && !_componentsYoutubeView2['default'].isYouTube(get('Left item'));
      });

      // Left image is default image

      ok(function () {
        return get('Left image').attr('src').then(function (src) {
          return src.should.be.exactly(_configJson2['default']['public']['default item image']);
        });
      }, 'Left image is default image', function () {
        return !get('Left item').image && !_componentsYoutubeView2['default'].isYouTube(get('Left item'));
      });

      // YouTube

      ok(function () {
        return get('Left video').is(':visible');
      }, 'Left image is a YouTube video', function () {
        return _componentsYoutubeView2['default'].isYouTube(get('Left item'));
      });

      ok(function () {
        return get('Left video').attr('src').then(function (src) {
          var v = _componentsYoutubeView2['default'].getId(get('Left item').references[0].url);
          src.should.be.exactly('http://www.youtube.com/embed/' + v + '?autoplay=0');
        });
      }, 'Left YouTube video is the same link than in DB', function () {
        return _componentsYoutubeView2['default'].isYouTube(get('Left item'));
      });

      // Subject

      ok(function () {
        return get('Left subject').text().then(function (text) {
          return text.should.be.exactly(get('Left item').subject);
        });
      }, 'Left subject is same than DB');

      // Description

      ok(function () {
        return get('Left description').text().then(function (text) {
          return text.should.be.exactly(_libAppMilk2['default'].formatToHTMLText(get('Left item').description));
        });
      }, 'Left description is same than DB');

      // References

      ok(function () {
        return get('Left reference').text().then(function (text) {
          return text.should.be.exactly(get('Left item').references[0].title);
        });
      }, 'Left reference has the right title', function () {
        return get('Left item').references[0] && get('Left item').references[0].title;
      });

      ok(function () {
        return get('Left reference').text().then(function (text) {
          return text.should.be.exactly(get('Left item').references[0].url);
        });
      }, 'Left reference has the right url but no title', function () {
        return get('Left item').references[0] && !get('Left item').references[0].title;
      });

      ok(function () {
        return get('Left reference').attr('href').then(function (href) {
          try {
            href.should.be.exactly(get('Left item').references[0].url);
          } catch (error) {
            href.replace(/\/$/, '').should.be.exactly(get('Left item').references[0].url);
          }
        });
      }, 'Left reference has the right url', function () {
        return get('Left item').references[0];
      });

      ok(function () {
        return get('Left reference').attr('target').then(function (target) {
          return target.should.be.exactly('_blank');
        });
      }, 'Left reference link opens in a new tab', function () {
        return get('Left item').references[0];
      });

      ok(function () {
        return get('Left reference').attr('rel').then(function (rel) {
          return rel.should.be.exactly('nofollow');
        });
      }, 'Left reference link is not indexed by SEO', function () {
        return get('Left item').references[0];
      });

      // Criterias

      ok(function () {
        return get('Left criteria').text().then(function (text) {
          text.should.be.an.Array;
          get('Evaluation').criterias.forEach(function (criteria, i) {
            criteria.name.should.be.exactly(text[i]);
          });
        });
      }, 'Left criterias should be same than DB');

      var _loop3 = function (i) {
        ok(function () {
          return get('Left criteria name #' + i).click();
        }, 'Click on Criteria #' + i);

        _this3.wait(1);

        ok(function () {
          return get('Left criteria description #' + i).text().then(function (text) {
            text.should.be.a.String;
            get('Evaluation').criterias[i].description.should.be.exactly(text);
          });
        }, 'Criteria description is correct #' + i);
      };

      for (var i = 0; i < 4; i++) {
        _loop3(i);
      }

      ok(function () {
        return get('Left feedback').is(':visible');
      }, 'Left feedback is visible');
    }
  }, {
    key: 'rightSide',
    value: function rightSide(id) {
      var _this4 = this;

      console.log('right side', id);
      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);
      var find = this.find.bind(this);

      set('Right item', function () {
        return _modelsItem2['default'].findById(id).exec();
      });

      // Has image

      ok(function () {
        return get('Right image').attr('src').then(function (src) {
          return src.should.be.exactly((0, _libUtilCloudinaryFormat2['default'])(get('Right item').image));
        });
      }, 'Right image', function () {
        return get('Right item').image && !_componentsYoutubeView2['default'].isYouTube(get('Right item'));
      });

      // Default image

      ok(function () {
        return get('Right image').attr('src').then(function (src) {
          return src.should.be.exactly(_configJson2['default']['public']['default item image']);
        });
      }, 'Right image is default image', function () {
        return !get('Right item').image && !_componentsYoutubeView2['default'].isYouTube(get('Right item'));
      });

      // YouTube

      ok(function () {
        return get('Right video').is(':visible');
      }, 'Right image is a YouTube video', function () {
        return _componentsYoutubeView2['default'].isYouTube(get('Right item'));
      });

      ok(function () {
        return get('Right video').attr('src').then(function (src) {
          var v = _componentsYoutubeView2['default'].getId(get('Right item').references[0].url);
          src.should.be.exactly('http://www.youtube.com/embed/' + v + '?autoplay=0');
        });
      }, 'Right YouTube video is the same link than in DB', function () {
        return _componentsYoutubeView2['default'].isYouTube(get('Right item'));
      });

      // Subject

      ok(function () {
        return get('Right subject').text().then(function (text) {
          return text.should.be.exactly(get('Right item').subject);
        });
      }, 'Right subject is same than DB');

      // Description

      ok(function () {
        return get('Right description').text().then(function (text) {
          return text.should.be.exactly(_libAppMilk2['default'].formatToHTMLText(get('Right item').description));
        });
      }, 'Right description is same than DB');

      // References

      ok(function () {
        return get('Right reference').text().then(function (text) {
          return text.should.be.exactly(get('Right item').references[0].title);
        });
      }, 'Right reference has the right title', function () {
        return get('Right item').references[0] && get('Right item').references[0].title;
      });

      ok(function () {
        return get('Right reference').text().then(function (text) {
          return text.should.be.exactly(get('Right item').references[0].url);
        });
      }, 'Right reference has the right url but no title', function () {
        return get('Right item').references[0] && !get('Right item').references[0].title;
      });

      ok(function () {
        return get('Right reference').attr('href').then(function (href) {
          try {
            href.should.be.exactly(get('Right item').references[0].url);
          } catch (error) {
            href.replace(/\/$/, '').should.be.exactly(get('Right item').references[0].url);
          }
        });
      }, 'Right reference has the right url', function () {
        return get('Right item').references[0];
      });

      ok(function () {
        return get('Right reference').attr('target').then(function (target) {
          return target.should.be.exactly('_blank');
        });
      }, 'Right reference link opens in a new tab', function () {
        return get('Right item').references[0];
      });

      ok(function () {
        return get('Right reference').attr('rel').then(function (rel) {
          return rel.should.be.exactly('nofollow');
        });
      }, 'Right reference link is not indexed by SEO', function () {
        return get('Right item').references[0];
      });

      // Criterias

      ok(function () {
        return get('Right criteria').text().then(function (text) {
          text.should.be.an.Array;
          get('Evaluation').criterias.forEach(function (criteria, i) {
            criteria.name.should.be.exactly(text[i]);
          });
        });
      }, 'Right criterias should be same than DB');

      var _loop4 = function (i) {
        ok(function () {
          return get('Right criteria name #' + i).click();
        }, 'Click on Criteria #' + i);

        _this4.wait(1);

        ok(function () {
          return get('Right criteria description #' + i).text().then(function (text) {
            text.should.be.a.String;
            get('Evaluation').criterias[i].description.should.be.exactly(text);
          });
        }, 'Criteria description is correct #' + i);
      };

      for (var i = 0; i < 4; i++) {
        _loop4(i);
      }
    }
  }]);

  return Promote;
})(_libAppMilk2['default']);

exports['default'] = Promote;
module.exports = exports['default'];