'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fixturesState1Json = require('../../../../fixtures/state/1.json');

var _fixturesState1Json2 = _interopRequireDefault(_fixturesState1Json);

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
          _this.find({ __V: 2 }).then(function (documents) {
            try {
              if (documents.length) {
                return ok();
              }
              _this.create(_fixturesState1Json2['default']).then(function (created) {
                try {
                  _libMung2['default'].Migration.create({
                    model: _this.name,
                    collection: _this.toCollectionName(),
                    version: 2,
                    created: created.map(function (doc) {
                      return doc._id;
                    })
                  }).then(ok, ko);
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
    key: 'undo',
    value: function undo() {
      var _this2 = this;

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var getSavedDocuments = function getSavedDocuments(props) {
              return new Promise(function (ok, ko) {
                try {
                  _libMung2['default'].Migration.findOne({
                    model: _this2.name,
                    collection: _this2.toCollectionName(),
                    version: 2
                  }, { limit: false }).then(function (document) {
                    try {
                      props.documents = document.created.map(function (doc) {
                        return doc._id;
                      });
                      ok();
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);

                  var deleteDocuments = function deleteDocuments(props) {
                    return _this2.removeByIds.apply(_this2, _toConsumableArray(props.documents));
                  };

                  _libMung2['default'].runSequence([getSavedDocuments, deleteDocuments]).then(ok, ko);
                } catch (error) {
                  ko(error);
                }
              });
            };
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return V2;
})();

exports['default'] = V2;
module.exports = exports['default'];