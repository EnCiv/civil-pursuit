'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function lowerEmail(doc) {
  return new Promise(function (ok, ko) {
    try {
      doc.set('email', doc.email.toLowerCase());
      ok();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = lowerEmail;
module.exports = exports['default'];