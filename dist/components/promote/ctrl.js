'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libUtilNav = require('../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var _componentsEditAndGoAgainCtrl = require('../../components/edit-and-go-again/ctrl');

var _componentsEditAndGoAgainCtrl2 = _interopRequireDefault(_componentsEditAndGoAgainCtrl);

var _libAppController = require('../../lib/app/controller');

var _libAppController2 = _interopRequireDefault(_libAppController);

var _componentsPromoteControllersRender = require('../../components/promote/controllers/render');

var _componentsPromoteControllersRender2 = _interopRequireDefault(_componentsPromoteControllersRender);

var _componentsPromoteControllersRenderItem = require('../../components/promote/controllers/render-item');

var _componentsPromoteControllersRenderItem2 = _interopRequireDefault(_componentsPromoteControllersRenderItem);

var _componentsPromoteControllersFinish = require('../../components/promote/controllers/finish');

var _componentsPromoteControllersFinish2 = _interopRequireDefault(_componentsPromoteControllersFinish);

var Promote = (function (_Controller) {
  function Promote(props, itemController) {
    var _this = this;

    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this);

    this.props = props || {};

    if (this.props.item) {
      this.set('item', this.props.item);
    }

    this.template = itemController.find('promote');

    this.itemController = itemController;

    this.store = {
      item: null,
      limit: 5,
      cursor: 1,
      left: null,
      right: null,
      criterias: [],
      items: []
    };

    this.on('set', function (key, value) {
      switch (key) {
        case 'limit':
          _this.renderLimit(value);
          break;

        case 'cursor':
          _this.renderCursor(value);
          break;

        case 'left':
          _this.renderLeft(value);
          break;

        case 'right':
          _this.renderRight(value);
          break;
      }
    });

    this.domain.run(function () {
      if (!_this.template.length) {
        throw new Error('Promote template not found');
      }
    });
  }

  _inherits(Promote, _Controller);

  _createClass(Promote, [{
    key: 'find',
    value: function find(name, more) {
      switch (name) {

        case 'item subject':
          return this.template.find('.subject.' + more + '-item h4');

        case 'item description':
          return this.template.find('.description.' + more + '-item');;

        case 'cursor':
          return this.template.find('.cursor');

        case 'limit':
          return this.template.find('.limit');

        case 'side by side':
          return this.template.find('.items-side-by-side');

        case 'finish button':
          return this.template.find('.finish');

        case 'sliders':
          return this.find('side by side').find('.sliders.' + more + '-item');

        case 'item image':
          return this.find('side by side').find('.image.' + more + '-item');

        case 'item persona':
          return this.find('side by side').find('.persona.' + more + '-item');

        case 'item references':
          return this.find('side by side').find('.references.' + more + '-item a');

        case 'item persona image':
          return this.find('item persona', more).find('img');

        case 'item persona name':
          return this.find('item persona', more).find('.user-full-name');

        case 'item feedback':
          return this.find('side by side').find('.' + more + '-item.feedback .feedback-entry');

        case 'promote button':
          return this.find('side by side').find('.' + more + '-item .promote');

        case 'promote label':
          return this.find('side by side').find('.promote-label');

        case 'edit and go again button':
          return this.find('side by side').find('.' + more + '-item .edit-and-go-again-toggle');
      }
    }
  }, {
    key: 'renderLimit',
    value: function renderLimit(limit) {
      this.find('limit').text(limit);
    }
  }, {
    key: 'renderCursor',
    value: function renderCursor(cursor) {
      this.find('cursor').text(cursor);
    }
  }, {
    key: 'renderLeft',
    value: function renderLeft(left) {
      this.renderItem('left', left);
    }
  }, {
    key: 'renderRight',
    value: function renderRight(right) {
      this.renderItem('right', right);
    }
  }, {
    key: 'renderItem',
    value: function renderItem(hand, item) {
      return _componentsPromoteControllersRenderItem2['default'].apply(this, [hand, item]);
    }
  }, {
    key: 'render',
    value: function render(cb) {
      return _componentsPromoteControllersRender2['default'].apply(this, [cb]);
    }
  }, {
    key: 'finish',
    value: function finish(cb) {
      return _componentsPromoteControllersFinish2['default'].apply(this, [cb]);
    }
  }, {
    key: 'save',
    value: function save(hand, cb) {

      // For responsiveness reasons, there are a copy of each element in DOM
      // one for small screen and one for regular screen -
      // the ones that do not fit are hidden. So we want to make sure each time
      // that we are working with the visible one

      var self = this;

      // feedback

      var feedback = this.find('item feedback', hand).toArray().reduce(function (visible, item) {
        if ($(item).is(':visible')) {
          visible = $(item);
        }
        return visible;
      });

      if (feedback.val()) {

        if (!feedback.hasClass('do-not-save-again')) {
          this.publish('insert feedback', {
            item: this.get(hand)._id,
            feedback: feedback.val()
          }).subscribe(function (pubsub) {
            return pubsub.unsubscribe();
          });

          feedback.addClass('do-not-save-again');
        }

        // feedback.val('');
      }

      // votes

      var votes = [];

      this.template.find('.items-side-by-side:visible .' + hand + '-item input[type="range"]:visible').each(function () {
        var vote = {
          item: self.get(hand)._id,
          value: +$(this).val(),
          criteria: $(this).data('criteria')
        };

        votes.push(vote);
      });

      this.publish('insert votes', votes).subscribe(function (pubsub) {
        return pubsub.unsubscribe();
      });

      if (typeof cb === 'function') {
        cb();
      }
    }
  }, {
    key: 'getEvaluation',
    value: function getEvaluation(cb) {
      var _this2 = this;

      if (!this.get('left')) {
        (function () {

          var item = _this2.itemController.get('item');

          // Get evaluation via sockets

          _this2.publish('get evaluation', item._id).subscribe(function (pubsub, evaluation) {
            if (evaluation.item.toString() === item._id.toString()) {
              console.info('got evaluation', evaluation);

              pubsub.unsubscribe();

              var limit = 5;

              if (evaluation.items.length < 6) {
                limit = evaluation.items.length - 1;

                if (!evaluation.limit && evaluation.items.length === 1) {
                  limit = 1;
                }
              }

              _this2.set('criterias', evaluation.criterias);

              _this2.set('items', evaluation.items);

              _this2.set('limit', limit);

              _this2.set('cursor', 1);

              _this2.set('left', evaluation.items[0]);

              _this2.set('right', evaluation.items[1]);

              cb();
            }
          });
        })();
      } else {
        cb();
      }
    }
  }]);

  return Promote;
})(_libAppController2['default']);

exports['default'] = Promote;
module.exports = exports['default'];