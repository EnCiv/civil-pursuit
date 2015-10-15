'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libAppCollectionId = require('../../../lib/app/collection-id');

var _libAppCollectionId2 = _interopRequireDefault(_libAppCollectionId);

function generateId(doc) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (0, _libAppCollectionId2['default'])(_this).then(function (id) {
        doc.set('id', id);
        ok();
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = generateId;
module.exports = exports['default'];