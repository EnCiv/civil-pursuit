'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _domain = require('domain');

var _events = require('events');

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _criteria = require('../../criteria');

var _criteria2 = _interopRequireDefault(_criteria);

var _type = require('../../type');

var _type2 = _interopRequireDefault(_type);

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
    this.type = 'regular';

    this.domain.on('error', function (error) {
      return _this.emit('error', error);
    });
  }

  _inherits(Evaluator, _EventEmitter);

  _createClass(Evaluator, [{
    key: 'getItem',

    // Get model item from DB and panelify it

    value: function getItem() {
      var _this2 = this;

      return new Promise(function (ok, ko) {
        try {
          _this2.ItemModel.findById(_this2.itemId).exec().then(function (item) {
            try {
              if (!item) {
                throw new Error('Item not found');
              }

              item.toPanelItem().then(function (item) {
                try {
                  _this2.item = item;
                  ok();
                } catch (error) {
                  _this2.emit('error', error);
                }
              }, ko);
            } catch (error) {
              _this2.emit('error', error);
            }
          }, function (error) {
            return _this2.emit('error', error);
          });
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'go',
    value: function go() {
      var _this3 = this;

      return new Promise(function (ok, ko) {
        try {
          _this3.getItem().then(function () {
            _this3.item.type.isHarmony().then(function (is) {
              try {
                if (is) {
                  _this3.type = 'split';
                  _this3.makeSplit().then(ok, ko);
                } else {
                  _this3.make().then(ok, ko);
                }
              } catch (error) {
                _this3.emit('error', error);
              }
            }, ko);
          }, ko);
        } catch (error) {
          _this3.emit('error', error);
        }
      });
    }
  }, {
    key: 'findType',
    value: function findType(typeId) {
      return _type2['default'].findOne(typeId).exec();
    }
  }, {
    key: 'make',
    value: function make() {
      var _this4 = this;

      return new Promise(function (ok, ko) {

        try {
          Promise.all([_this4.findOthers(OTHERS), _criteria2['default'].find().exec()]).then(function (results) {
            try {
              var _results = _slicedToArray(results, 2);

              var items = _results[0];
              var criterias = _results[1];

              _this4.packAndGo({ items: items, criterias: criterias }).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'makeSplit',
    value: function makeSplit() {
      var _this5 = this;

      return new Promise(function (ok, ko) {
        try {
          _this5.item.type.getOpposite().then(function (right) {
            try {
              var promises = [_this5.findOthers(5), _this5.findOthers(6, right), _criteria2['default'].find().exec()];

              Promise.all(promises).then(function (results) {
                try {
                  var _results2 = _slicedToArray(results, 3);

                  var left = _results2[0];
                  var _right = _results2[1];
                  var criterias = _results2[2];

                  _this5.packAndGo({ left: left, right: _right, criterias: criterias }).then(ok, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'findOthers',
    value: function findOthers(limit, type) {
      var _this6 = this;

      return new Promise(function (ok, ko) {
        try {
          var _iteratorNormalCompletion;

          var _didIteratorError;

          var _iteratorError;

          var _iterator, _step;

          (function () {

            var query = {};

            if (type) {
              query.type = type._id;
            } else {
              query.type = _this6.item.type._id;
            }

            if (_this6.item.lineage.length) {
              var _parent = undefined;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;

              try {
                for (_iterator = _this6.item.lineage[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var ancestor = _step.value;

                  _parent = ancestor;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              query.parent = _parent._id;
            }

            _this6.ItemModel.count(query).where('_id').ne(_this6.item._id)

            // .where('user').ne(this.userId)

            .exec(_this6.domain.intercept(function (number) {

              var start = Math.max(0, Math.floor((number - limit) * Math.random()));

              _this6.ItemModel.find(query)

              // .populate('user')

              .where('_id').ne(_this6.item._id)

              // .where('user').ne(this.userId)

              .skip(start).limit(limit).sort({ views: 1, created: 1 }).exec().then(function (items) {
                Promise.all(items.map(function (item) {
                  return item.toPanelItem();
                })).then(ok, ko);
              }, ko);
            }));
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'packAndGo',
    value: function packAndGo(results) {
      var _this7 = this;

      return new Promise(function (ok, ko) {
        if (!('items' in results) && 'left' in results) {
          results.items = [];

          if (_configJson2['default']['evaluation context item position'] === 'first') {
            results.left.unshift(_this7.item);
          } else if (_configJson2['default']['evaluation context item position'] === 'last') {
            results.left.push(_this7.item);
          }

          var max = 6;

          if (results.left.length < max) {
            max = results.left.length;
          }

          if (results.right.length < max) {
            max = results.right.length;
          }

          for (var i = 0; i < max; i++) {
            if (results.left[i]) {
              results.items.push(results.left[i]);
            }

            if (results.right[i]) {
              results.items.push(results.right[i]);
            }
          }
        } else {
          if (_configJson2['default']['evaluation context item position'] === 'first') {
            results.items.unshift(_this7.item);
          } else if (_configJson2['default']['evaluation context item position'] === 'first') {
            results.items.push(_this7.item);
          }
        }

        var evaluation = new Evaluation({
          split: _this7.type === 'split',
          type: _this7.item.type,
          item: _this7.itemId,
          items: results.items /*.map(this.map, this)*/,
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
      var _this8 = this;

      return new Promise(function (ok, ko) {
        new Evaluator(_this8, userId, itemId).on('error', ko).go().then(ok, ko);
      });
    }
  }]);

  return Evaluator;
})(_events.EventEmitter);

exports['default'] = Evaluator.Factory;
module.exports = exports['default'];