'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _domain = require('domain');

var _events = require('events');

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _synModelsCriteria = require('syn/models/criteria');

var _synModelsCriteria2 = _interopRequireDefault(_synModelsCriteria);

var _synModelsType = require('syn/models/type');

var _synModelsType2 = _interopRequireDefault(_synModelsType);

var OTHERS = 5;

var Evaluation = function Evaluation(props) {
  _classCallCheck(this, Evaluation);

  for (var i in props) {
    this[i] = props[i];
  }
};

var Evaluator = (function (_EventEmitter) {
  function Evaluator(model, userId, itemId) {
    var _this = this;

    _classCallCheck(this, Evaluator);

    _get(Object.getPrototypeOf(Evaluator.prototype), 'constructor', this).call(this);

    this.ItemModel = model;
    this.itemId = itemId;
    this.userId = userId;
    this.domain = new _domain.Domain();

    this.domain.on('error', function (error) {
      return _this.emit('error', error);
    });
  }

  _inherits(Evaluator, _EventEmitter);

  _createClass(Evaluator, [{
    key: 'go',
    value: function go() {
      var _this2 = this;

      return new Promise(function (ok, ko) {
        _this2.domain.run(function () {
          _this2.ItemModel.findById(_this2.itemId).populate('user').exec(_this2.domain.intercept(function (item) {

            if (!item) {
              throw new Error('Item not found');
            }

            _this2.item = item;

            _this2.findType({ parent: _this2.item.type }).then(function (parentType) {
              if (!parentType) {
                _this2.make().then(ok, ko);
              } else if (parentType.harmony && parentType.harmony.length && parentType.harmony.some(function (h) {
                return h.toString() === _this2.item.type.toString();
              })) {
                _this2.makeSplit().then(ok, ko);
              } else {
                _this2.make().then(ok, ko);
              }
            }, ko);
          }));
        });
      });
    }
  }, {
    key: 'findType',
    value: function findType(typeId) {
      return _synModelsType2['default'].findOne(typeId).exec();
    }
  }, {
    key: 'make',
    value: function make() {
      var _this3 = this;

      return new Promise(function (ok, ko) {

        Promise.all([_this3.findOthers(OTHERS), _synModelsCriteria2['default'].find({ type: _this3.item.type }).populate('type').exec()]).then(function (results) {
          _this3.packAndGo({
            items: results[0],
            criterias: results[1]
          }).then(ok, ko);
        }, ko);
      });
    }
  }, {
    key: 'makeSplit',
    value: function makeSplit() {
      var _this4 = this;

      return new Promise(function (ok, ko) {
        var right = undefined;

        switch (_this4.item.type) {
          case 'Agree':
            right = 'Disagree';
            break;

          case 'Disagree':
            right = 'Agree';
            break;

          case 'Pro':
            right = 'Con';
            break;

          case 'Con':
            right = 'Pro';
            break;
        }

        var promises = [_this4.findOthers(2), _this4.findOthers(3, right), _synModelsCriteria2['default'].find({ type: _this4.item.type }).populate('type').exec()];

        Promise.all(promise).then(function (results) {
          _this4.packAndGo({
            left: results[0],
            right: results[1],
            criterias: results[2]
          }).then(ok, ko);
        });
      });
    }
  }, {
    key: 'findOthers',
    value: function findOthers(limit, type) {
      var _this5 = this;

      return new Promise(function (ok, ko) {
        var query = {
          type: type || _this5.item.type,
          parent: _this5.item.parent
        };

        _this5.ItemModel.count(query).where('_id').ne(_this5.item._id)

        // .where('user').ne(this.userId)

        .exec(_this5.domain.intercept(function (number) {

          var start = Math.max(0, Math.floor((number - limit) * Math.random()));

          _this5.ItemModel.find(query).populate('user').where('_id').ne(_this5.item._id)

          // .where('user').ne(this.userId)

          .skip(start).limit(limit).sort({ views: 1, created: 1 }).exec().then(ok, ko);
        }));
      });
    }
  }, {
    key: 'packAndGo',
    value: function packAndGo(results) {
      var _this6 = this;

      return new Promise(function (ok, ko) {
        if (!('items' in results) && 'left' in results) {
          results.items = [];

          for (var i = 0; i < 3; i++) {
            if (results.left[i]) {
              results.items.push(results.left[i]);
            }

            if (results.right[i]) {
              results.items.push(results.right[i]);
            }
          }
        }

        if (_synConfigJson2['default']['evaluation context item position'] === 'last') {
          results.items.push(_this6.item);
        } else {
          results.items.unshift(_this6.item);
        }

        var evaluation = new Evaluation({
          type: _this6.item.type,
          item: _this6.itemId,
          items: results.items.map(_this6.map, _this6),
          criterias: results.criterias
        });

        ok(evaluation);
      });
    }
  }, {
    key: 'map',
    value: function map(item) {

      return item.toObject({ transform: function transform(doc, ret, options) {
          if (ret.user) {
            delete ret.user.password;
          }
        } });
    }
  }], [{
    key: 'Factory',
    value: function Factory(userId, itemId) {
      var _this7 = this;

      return new Promise(function (ok, ko) {
        new Evaluator(_this7, userId, itemId).on('error', ko).go().then(ok, ko);
      });
    }
  }]);

  return Evaluator;
})(_events.EventEmitter);

exports['default'] = Evaluator.Factory;
module.exports = exports['default'];