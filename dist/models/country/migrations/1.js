'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _libMung = require('../../../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var collection = 'countries';

var V1 = (function () {
  function V1() {
    _classCallCheck(this, V1);
  }

  _createClass(V1, null, [{
    key: 'do',
    value: function _do() {
      var _this = this;

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var documentsWithNoVersion = { __V: { $exists: false } };

            var findDocumentsWithNoVersion = function findDocumentsWithNoVersion(props) {
              return new Promise(function (ok, ko) {
                try {
                  _this.find(documentsWithNoVersion, { limit: false }).then(function (documents) {
                    try {
                      props.documentsWithNoVersion = documents;
                      ok();
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } catch (error) {
                  ko(error);
                }
              });
            };

            var saveDocumentsWithNoVersion = function saveDocumentsWithNoVersion(props) {
              return new Promise(function (ok, ko) {
                try {
                  if (!props.documentsWithNoVersion.length) {
                    return ok();
                  }
                  _libMung2['default'].Migration.create({
                    collection: collection,
                    version: 1,
                    undo: props.documentsWithNoVersion.map(function (doc) {
                      return {
                        id: doc._id,
                        unset: ['__V']
                      };
                    })
                  }).then(ok, ko);
                } catch (error) {
                  ko(error);
                }
              });
            };

            var tagDocuments = function tagDocuments(props) {
              return new Promise(function (ok, ko) {
                try {
                  if (!props.documentsWithNoVersion.length) {
                    return ok();
                  }
                  _this.update(documentsWithNoVersion, { __V: 2 }).then(ok, ko);
                } catch (error) {
                  ko(error);
                }
              });
            };

            _libMung2['default'].runSequence([findDocumentsWithNoVersion, saveDocumentsWithNoVersion, tagDocuments]).then(ok, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'undo',
    value: function undo() {
      return _libMung2['default'].Migration.undo(this, 1, collection);
    }
  }]);

  return V1;
})();

exports['default'] = V1;
module.exports = exports['default'];