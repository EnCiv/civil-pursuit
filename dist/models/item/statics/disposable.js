'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _synModelsType = require('syn/models/type');

var _synModelsType2 = _interopRequireDefault(_synModelsType);

var _synModelsUser = require('syn/models/user');

var _synModelsUser2 = _interopRequireDefault(_synModelsUser);

var _synModelsItem = require('syn/models/item');

var _synModelsItem2 = _interopRequireDefault(_synModelsItem);

var _domain = require('domain');

function shuffle(array) {
  var currentIndex = array.length,
      temporaryValue,
      randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var DisposableItem = (function () {
  function DisposableItem() {
    _classCallCheck(this, DisposableItem);
  }

  _createClass(DisposableItem, null, [{
    key: 'dispose',
    value: function dispose(options) {
      options = options || {};

      return new Promise(function (ok, ko) {
        try {
          Promise.all([DisposableItem.findType(options), _synModelsUser2['default'].disposable()]).then(function (results) {
            try {
              (function () {
                var type = results[0];
                var users = results.filter(function (r, i) {
                  return i;
                });

                type.getParents().then(function (parents) {
                  try {

                    if (!parents) {
                      DisposableItem.createItem({ type: type, user: shuffle(users)[0] }).then(ok, ko);
                    } else {
                      (function () {
                        parents.reverse();

                        var cursor = 0;

                        var parentItem = undefined;

                        var createItem = function createItem(parent) {

                          if (parents[cursor]) {
                            DisposableItem.createItem({
                              type: parents[cursor],
                              parent: parent,
                              user: shuffle(users)[0]
                            }).then(function (item) {
                              parentItem = item;
                              cursor++;
                              createItem(item);
                            }, ko);
                          } else {
                            parents.reverse();

                            DisposableItem.createItem({
                              type: type,
                              parent: parentItem,
                              user: shuffle(users)[0]
                            }).then(ok, ko);
                          }
                        };

                        createItem();
                      })();
                    }
                  } catch (error) {
                    ko(error);
                  }
                }, ko);
              })();
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
    key: 'findType',
    value: function findType(options) {

      options = options || {};

      return new Promise(function (ok, ko) {

        try {

          if (options.type) {
            // Object ID
            if (typeof options.type === 'object') {
              _synModelsType2['default'].findById(options.type).exec().then(ok, ko);
            }
          }
          // Find any type
          else {
            _synModelsType2['default'].findOneRandom(function (error, type) {
              if (error) {
                return ko(error);
              }
              ok(type);
            });
          }
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'createItem',
    value: function createItem(options) {

      options = options || {};

      var type = options.type;
      var user = options.user;
      var parent = options.parent;

      return new Promise(function (ok, ko) {

        try {
          var newItem = {
            subject: 'Disposable ' + type.name,
            description: 'Disposable Item of type ' + type.name + '\nCreated ' + new Date(),
            user: user._id,
            type: type._id
          };

          if (parent) {
            newItem.parent = parent._id;
          }

          // Create item in DB and done

          var d = new _domain.Domain().on('error', ko);

          _synModelsItem2['default'].create(newItem, d.intercept(function (item) {
            return ok(item);
          }));
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return DisposableItem;
})();

exports['default'] = DisposableItem.dispose;
module.exports = exports['default'];