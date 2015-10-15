'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _libMung = require('../../../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var V2 = (function () {
  function V2() {
    _classCallCheck(this, V2);
  }

  _createClass(V2, null, [{
    key: 'do',
    value: function _do() {
      var _this = this;

      return new Promise(function (ok, ko) {
        try {

          _this.count().then(function (count) {
            try {
              var _ret = (function () {
                if (count) {
                  return {
                    v: ok()
                  };
                }

                var db = _libMung2['default'].connections[0].db;

                db.collections().then(function (collections) {
                  try {
                    if (collections.some(function (collection) {
                      return collection.s.namespace.split(/\./)[1] === 'configs';
                    })) {
                      db.collection('configs').find().toArray().then(function (configs) {
                        try {
                          _this.create(configs[0].employment.map(function (employment) {
                            employment.__V = 2;

                            return employment;
                          }), { create: true }).then(ok, ko);
                        } catch (error) {
                          ko(error);
                        }
                      }, ko);
                    } else {
                      ok();
                    }
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
  }, {
    key: 'undo',
    value: function undo() {
      return this.remove({ __V: 2 });
    }
  }]);

  return V2;
})();

exports['default'] = V2;
module.exports = exports['default'];