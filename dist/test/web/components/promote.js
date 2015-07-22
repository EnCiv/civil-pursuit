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

var _modelsVote = require('../../../models/vote');

var _modelsVote2 = _interopRequireDefault(_modelsVote);

var _modelsFeedback = require('../../../models/feedback');

var _modelsFeedback2 = _interopRequireDefault(_modelsFeedback);

var _libUtilCloudinaryFormat = require('../../../lib/util/cloudinary-format');

var _libUtilCloudinaryFormat2 = _interopRequireDefault(_libUtilCloudinaryFormat);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsYoutubeView = require('../../../components/youtube/view');

var _componentsYoutubeView2 = _interopRequireDefault(_componentsYoutubeView);

var _details = require('./details');

var _details2 = _interopRequireDefault(_details);

var Promote = (function (_Milk) {
  function Promote(props) {
    _classCallCheck(this, Promote);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, 'Promote', options);

    this.props = props;

    console.log('PROMOTE props', props);

    this.set('Item View', this.props.item.View);
    this.set('Item Document', this.props.item.Document);

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

      // Cookie

      set('Cookie', function () {
        return _this.getCookie('synuser');
      });

      // Evaluation -- won't be the same than in Browser since evaluation are random, but like this we get the numbers of items in an evaluation - it should be 6 but it can be less -- also like this we get criterias

      set('Evaluation', function () {
        return _modelsItem2['default'].evaluate(get('Cookie').id, _this.get('Item Document')._id);
      });

      set('Main', function () {
        return find(get('Item View').selector + ' > .item-collapsers > .promote');
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

        set('Left criteria slider #' + i, function () {
          return find(get('View').selector + ' .left-item.sliders .criteria-' + i + ' input[type="range"]');
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

        set('Right criteria slider #' + i, function () {
          return find(get('View').selector + ' .right-item.sliders .criteria-' + i + ' input[type="range"]');
        });
      };

      for (var i = 0; i < 4; i++) {
        _loop2(i);
      }

      set('Left feedback', function () {
        return find(get('View').selector + ' .left-item.feedback textarea.feedback-entry');
      });

      set('Left feedback value', 'This a feedback for the left item');

      set('Right feedback', function () {
        return find(get('View').selector + ' .right-item.feedback textarea.feedback-entry');
      });

      set('Right feedback value', 'This a feedback for the right item');

      set('Promote label', function () {
        return find(get('View').selector + ' .promote-label-choose');
      });

      set('Promote left item button', function () {
        return find(get('View').selector + ' .left-item .promote');
      });

      set('Promote right item button', function () {
        return find(get('View').selector + ' .right-item .promote');
      });

      set('Edit and go again left button', function () {
        return find(get('View').selector + ' .left-item .edit-and-go-again-toggle');
      });

      set('Edit and go again right button', function () {
        return find(get('View').selector + ' .right-item .edit-and-go-again-toggle');
      });

      set('Finish button', function () {
        return find(get('Main').selector + ' button.finish');
      });

      set('Last action', 'null');
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
        return get('Item View').is(':visible');
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

      for (var i = 0; i < 4; i++) {
        this.cycle(i);
      }

      this.wait(2.5);

      this['import'](_details2['default'], function () {
        return {
          item: _this2.get('Item Document')
        };
      });
    }
  }, {
    key: 'cycle',
    value: function cycle(i) {
      i = i || 0;

      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);
      var find = this.find.bind(this);

      ok(function () {
        return new Promise(function (ok, ko) {
          console.log();
          console.log();
          console.log();
          console.log('Evaluation cycle, pass #' + i);
          console.log();
          console.log();
          console.log();
          ok();
        });
      }, 'Pass #' + i);

      ok(function () {
        return get('Cursor').text().then(function (text) {
          return text.should.be.exactly((i + 1).toString());
        });
      }, 'Cursor shows the right number', function () {
        get('Last action') === 'neither';
      });

      ok(function () {
        return get('Cursor').text().then(function (text) {
          return text.should.be.exactly(i.toString());
        });
      }, 'Cursor shows the right number', function () {
        get('Last action') !== 'neither';
      });

      this.wait(2);

      // Get left item's id

      this.leftSide();

      this.rightSide();

      ok(function () {
        return get('Promote label').is(':visible');
      }, 'Promote label is visible');

      ok(function () {
        return get('Promote label').text().then(function (text) {
          return text.trim().should.be.exactly('Which of these is most important for the community to consider?');
        });
      }, 'Promote label is visible');

      ok(function () {
        return get('Finish button').is(':visible');
      }, 'Finish button is visible');

      ok(function () {
        return get('Finish button').text().then(function (text) {
          return text.should.be.exactly('Neither');
        });
      }, 'Finish button text is "Neither"', function () {
        return i !== 3;
      });

      ok(function () {
        return new Promise(function (ok, ko) {
          console.log();
          console.log();
          console.log('Promoting left item');
          console.log();
          console.log();
          ok();
        });
      }, 'Promoting left item', function () {
        return i === 0;
      });

      ok(function () {
        return get('Promote left item button').click();
      }, 'Promote left item', function () {
        return i === 0;
      });

      set('Last action', 'promote left item', null, function () {
        return i === 0;
      });

      ok(function () {
        return new Promise(function (ok, ko) {
          console.log();
          console.log();
          console.log('Promoting right item');
          console.log();
          console.log();
          ok();
        });
      }, 'Promoting right item', function () {
        return i === 1;
      });

      ok(function () {
        return get('Promote right item button').click();
      }, 'Promote right item', function () {
        return i === 1;
      });

      set('Last action', 'promote right item', null, function () {
        return i === 1;
      });

      ok(function () {
        return new Promise(function (ok, ko) {
          console.log();
          console.log();
          console.log('Promoting neither');
          console.log();
          console.log();
          ok();
        });
      }, 'Promoting neither', function () {
        return i === 2;
      });

      ok(function () {
        return get('Finish button').click();
      }, 'Promote neither', function () {
        return i === 2;
      });

      ok(function () {
        return get('Finish button').text().then(function (text) {
          return text.should.be.exactly('Finish');
        });
      }, 'Neither button should now show text "Finish"', function () {
        return i === 3;
      });

      ok(function () {
        return get('Finish button').click();
      }, 'Promote neither', function () {
        return i === 3;
      });

      set('Last action', 'promote neither', null, function () {
        return i === 2;
      });

      this.wait(2);

      this.verifyVotes(i);

      this.verifyFeedback();

      this.verifyPromoted();
    }
  }, {
    key: 'leftSide',
    value: function leftSide() {
      var _this3 = this;

      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);
      var find = this.find.bind(this);

      // Find item in DB

      set('Left id', function () {
        return new Promise(function (ok, ko) {
          get('Side by side').attr('data-left-item').then(function (attr) {
            return ok(attr);
          });
        });
      });

      set('Left votes', function () {
        return new Promise(function (ok, ko) {
          get('Side by side').attr('data-left-votes').then(function (attr) {
            console.log('Left votes', get('Left id'), attr);
            ok(attr);
          }, ko);
        });
      });

      set('Left item', function () {
        return new Promise(function (ok, ko) {
          _modelsItem2['default'].findById(get('Left id')).exec().then(function (item) {
            console.log('left item', item);
            ok(item);
          }, ko);
        });
      });

      // Make sure views have incremented

      set('Left views', function () {
        return new Promise(function (ok, ko) {
          get('Side by side').attr('data-left-views').then(function (attr) {
            return ok(attr);
          });
        });
      });

      ok(function () {
        return new Promise(function (ok, ko) {
          +get('Left item').views.should.be.above(+get('Left views'));
          ok();
        });
      }, 'Views of left item should have incremented');

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
          return src.should.be.exactly((0, _libUtilCloudinaryFormat2['default'])(_configJson2['default']['public']['default item image']));
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

        // Slider

        ok(function () {
          return get('Left criteria slider #' + i).is(':visible');
        }, 'Criteria #' + i + ' has a left slider');

        ok(function () {
          return get('Left criteria slider #' + i).val().then(function (val) {
            return (+val).should.be.exactly(0);
          });
        }, 'Criteria #' + i + ' \'s left slider is 0', function () {
          return get('Last action') !== 'promote left item';
        });

        if (i === 0) {
          ok(function () {
            return get('Left criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s left slider', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s left slider to -1', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(-1);
            });
          }, 'Criteria #' + i + ' \'s left slider is -1');
        }

        if (i === 1) {
          ok(function () {
            return get('Left criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s left slider', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s left slider to -1', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s left slider is 1');
        }

        if (i === 2) {
          ok(function () {
            return get('Left criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s left slider', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s left slider to 1', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s left slider is 1', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s left slider to 0', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(0);
            });
          }, 'Criteria #' + i + ' \'s left slider is 0');
        }

        if (i === 3) {
          ok(function () {
            return get('Left criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s left slider', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s left slider to 1', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s left slider is 1', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s left slider to 1', function () {
            return get('Last action') !== 'promote left item';
          });

          ok(function () {
            return get('Left criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s left slider is 1');
        }
      };

      for (var i = 0; i < 4; i++) {
        _loop3(i);
      }

      // Feedback

      ok(function () {
        return get('Left feedback').is(':visible');
      }, 'Left feedback is visible');

      ok(function () {
        return get('Left feedback').val(get('Left feedback value'));
      }, 'Leave a feedback on left item', function () {
        return get('Last action') !== 'promote left item';
      });

      // Promote item

      ok(function () {
        return get('Promote left item button').is(':visible');
      }, 'You can see button to promote left item');

      ok(function () {
        return get('Promote left item button').text().then(function (text) {
          return text.should.be.exactly(get('Left item').subject);
        });
      }, 'Left promote button text is item\'s subject');

      // Edit and go again

      ok(function () {
        return get('Edit and go again left button').is(':visible');
      }, 'Edit and go again left button is visible');

      ok(function () {
        return get('Edit and go again left button').text().then(function (text) {
          return text.should.be.exactly('Edit and go again');
        });
      }, 'Edit and go again left button has the correct text');
    }
  }, {
    key: 'rightSide',
    value: function rightSide() {
      var _this4 = this;

      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);
      var find = this.find.bind(this);

      set('Right id', function () {
        return new Promise(function (ok, ko) {
          get('Side by side').attr('data-right-item').then(function (attr) {
            return ok(attr);
          });
        });
      });

      set('Right votes', function () {
        return new Promise(function (ok, ko) {
          get('Side by side').attr('data-right-votes').then(function (attr) {
            console.log('Right votes', get('Right id'), attr);
            ok(attr);
          }, ko);
        });
      });

      set('Right item', function () {
        return _modelsItem2['default'].findById(get('Right id')).exec();
      });

      set('Right views', function () {
        return new Promise(function (ok, ko) {
          get('Side by side').attr('data-right-views').then(function (attr) {
            return ok(attr);
          });
        });
      });

      // Make sure views have incremented

      ok(function () {
        return new Promise(function (ok, ko) {
          +get('Right item').views.should.be.above(+get('Right views'));
          ok();
        });
      }, 'Views of right item should have incremented');

      // Right is different from left

      ok(function () {
        return new Promise(function (ok, ko) {
          try {
            get('Right id').should.not.be.exactly(get('Left id'));
            ok();
          } catch (error) {
            ko(error);
          }
        });
      }, 'Left and right are different');

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
          return src.should.be.exactly((0, _libUtilCloudinaryFormat2['default'])(_configJson2['default']['public']['default item image']));
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

        // Slider

        ok(function () {
          return get('Right criteria slider #' + i).is(':visible');
        }, 'Criteria #' + i + ' has a right slider');

        ok(function () {
          return get('Right criteria slider #' + i).val().then(function (val) {
            return (+val).should.be.exactly(0);
          });
        }, 'Criteria #' + i + ' \'s right slider is 0', function () {
          return get('Last action') !== 'promote right item';
        });

        if (i === 1) {
          ok(function () {
            return get('Right criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s right slider', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s right slider to -1', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(-1);
            });
          }, 'Criteria #' + i + ' \'s right slider is -1');
        }

        if (i === 3) {
          ok(function () {
            return get('Right criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s right slider', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s right slider to -1', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s right slider is 1');
        }

        if (i === 2) {
          ok(function () {
            return get('Right criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s right slider', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s right slider to 1', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s right slider is 1', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s right slider to 0', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(0);
            });
          }, 'Criteria #' + i + ' \'s right slider is 0');
        }

        if (i === 0) {
          ok(function () {
            return get('Right criteria slider #' + i).click();
          }, 'Select criteria #' + i + ' \'s right slider', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s right slider to 1', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s right slider is 1', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).keys('');
          }, 'Set criteria #' + i + ' \'s right slider to 1', function () {
            return get('Last action') !== 'promote right item';
          });

          ok(function () {
            return get('Right criteria slider #' + i).val().then(function (val) {
              return (+val).should.be.exactly(1);
            });
          }, 'Criteria #' + i + ' \'s right slider is 1');
        }
      };

      for (var i = 0; i < 4; i++) {
        _loop4(i);
      }

      // Feedback

      ok(function () {
        return get('Right feedback').is(':visible');
      }, 'Right feedback is visible');

      ok(function () {
        return get('Right feedback').val(get('Right feedback value'));
      }, 'Leave a feedback on right item', function () {
        return get('Last action') !== 'promote right item';
      });

      // Promote item

      ok(function () {
        return get('Promote right item button').is(':visible');
      }, 'You can see button to promote right item');

      ok(function () {
        return get('Promote right item button').text().then(function (text) {
          return text.should.be.exactly(get('Right item').subject);
        });
      }, 'Right promote button text is item\'s subject');

      // Edit and go again

      ok(function () {
        return get('Edit and go again right button').is(':visible');
      }, 'Edit and go again right button is visible');

      ok(function () {
        return get('Edit and go again right button').text().then(function (text) {
          return text.should.be.exactly('Edit and go again');
        });
      }, 'Edit and go again right button has the correct text');
    }
  }, {
    key: 'verifyVotes',
    value: function verifyVotes(i) {
      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);
      var find = this.find.bind(this);

      // Votes should have incremented [LEFT]
      // if last action was anything but Promoting left item

      ok(function () {
        return new Promise(function (ok, ko) {
          var votes = +get('Left votes');
          var where = {
            item: get('Left item')._id
          };

          console.log('count', where);

          _modelsVote2['default'].where(where).count(function (error, count) {
            if (error) {
              return ko(error);
            }
            try {
              count.should.be.exactly(votes + 4);
              ok();
            } catch (error) {
              ko(error);
            }
          });
        });
      }, 'Votes should have incremented [LEFT]', function () {
        get('Last action') !== 'promote left item';
      });

      // Votes should have the right values [LEFT]
      // if last action was anything but Promoting left item

      ok(function () {
        return new Promise(function (ok, ko) {
          var cookie = JSON.parse(decodeURIComponent(get('Cookie').value.replace(/^j%3A/, '')));

          _modelsVote2['default'].find({
            user: cookie.id,
            item: get('Left item')._id
          }).sort({ _id: -1 }).limit(4).exec().then(function (votes) {
            try {
              votes.reverse();
              console.log('votes', votes);
              votes[0].value.should.be.exactly(-1);
              votes[1].value.should.be.exactly(1);
              votes[2].value.should.be.exactly(0);
              votes[3].value.should.be.exactly(1);
              ok();
            } catch (error) {
              ko(error);
            }
          }, ko);
        });
      }, 'Verify votes for left item got saved', function () {
        get('Last action') !== 'promote left item';
      });

      // Votes should have incremented [RIGHT]

      ok(function () {
        return new Promise(function (ok, ko) {
          var votes = +get('Right votes');
          var where = {
            item: get('Right item')._id
          };

          console.log('count', where);

          _modelsVote2['default'].where(where).count(function (error, count) {
            if (error) {
              return ko(error);
            }
            try {
              count.should.be.exactly(votes + 4);
              ok();
            } catch (error) {
              ko(error);
            }
          });
        });
      }, 'Votes should have incremented [RIGHT]', function () {
        get('Last action') !== 'promote right item';
      });

      // Votes should have incremented [RIGHT]

      ok(function () {
        return new Promise(function (ok, ko) {
          var cookie = JSON.parse(decodeURIComponent(get('Cookie').value.replace(/^j%3A/, '')));

          _modelsVote2['default'].find({
            user: cookie.id,
            item: get('Right item')._id
          }).sort({ _id: -1 }).limit(4).exec().then(function (votes) {
            try {
              votes.reverse();
              console.log('votes', votes);
              votes[0].value.should.be.exactly(1);
              votes[1].value.should.be.exactly(-1);
              votes[2].value.should.be.exactly(0);
              votes[3].value.should.be.exactly(1);
              ok();
            } catch (error) {
              ko(error);
            }
          }, ko);
        });
      }, 'Verify votes for right item got saved', function () {
        get('Last action') !== 'promote right item';
      });
    }
  }, {
    key: 'verifyFeedback',
    value: function verifyFeedback() {
      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);

      // Left feedback got saved
      // if last action was anything but Promoting left item

      ok(function () {
        return new Promise(function (ok, ko) {
          var cookie = JSON.parse(decodeURIComponent(get('Cookie').value.replace(/^j%3A/, '')));

          _modelsFeedback2['default'].findOne({
            item: get('Left id'),
            user: cookie.id
          }).sort({ _id: -1 }).exec().then(function (feedback) {
            console.log('got feedback', feedback);
            try {
              feedback.should.be.an.Object;
              feedback.feedback.should.be.exactly(get('Left feedback value'));
              ok();
            } catch (error) {
              ko(error);
            }
          }, ko);
        });
      }, 'Left feedback got saved', function () {
        get('Last action') !== 'promote left item';
      });

      // Right feedback got saved
      // if last action was anything but Promoting right item

      ok(function () {
        return new Promise(function (ok, ko) {
          var cookie = JSON.parse(decodeURIComponent(get('Cookie').value.replace(/^j%3A/, '')));

          _modelsFeedback2['default'].findOne({
            item: get('Right id'),
            user: cookie.id
          }).sort({ _id: -1 }).exec().then(function (feedback) {
            console.log('got feedback', feedback);
            try {
              feedback.should.be.an.Object;
              feedback.feedback.should.be.exactly(get('Right feedback value'));
              ok();
            } catch (error) {
              ko(error);
            }
          }, ko);
        });
      }, 'Right feedback got saved', function () {
        get('Last action') !== 'promote right item';
      });
    }
  }, {
    key: 'verifyPromoted',
    value: function verifyPromoted() {
      var ok = this.ok.bind(this);
      var get = this.get.bind(this);
      var set = this.set.bind(this);

      ok(function () {
        return new Promise(function (ok, ko) {
          _modelsItem2['default'].findById(get('Left id')).exec().then(function (item) {
            if (!item) {
              return ko(new Error('Could not find left item after promoting it'));
            }
            item.promotions.should.be.exactly(get('Left item').promotions + 1);
            ok();
          }, ko);
        });
      }, 'Left item promotions counter should have incremented by 1 in DB', function () {
        return get('Last action') === 'promote left item';
      });

      ok(function () {
        return new Promise(function (ok, ko) {
          _modelsItem2['default'].findById(get('Right id')).exec().then(function (item) {
            if (!item) {
              return ko(new Error('Could not find right item after promoting it'));
            }
            item.promotions.should.be.exactly(get('Right item').promotions + 1);
            ok();
          }, ko);
        });
      }, 'Right item promotions counter should have incremented by 1 in DB', function () {
        return get('Last action') === 'promote right item';
      });
    }
  }]);

  return Promote;
})(_libAppMilk2['default']);

exports['default'] = Promote;
module.exports = exports['default'];