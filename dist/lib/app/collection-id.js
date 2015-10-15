'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilRandomString = require('../util/random-string');

var _utilRandomString2 = _interopRequireDefault(_utilRandomString);

function generateShortId(Model) {
  return new Promise(function (ok, ko) {
    try {
      (0, _utilRandomString2['default'])(5).then(function (id) {
        try {

          Model.findOne({ id: id }).then(function (item) {
            try {
              if (!item) {
                ok(id);
              } else {
                generateShortId(ok, ko);
              }
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

exports['default'] = generateShortId;
module.exports = exports['default'];