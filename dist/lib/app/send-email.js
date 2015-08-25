'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _secretJson = require('../../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

function sendEmail() {
  var options = arguments[0] === undefined ? {} : arguments[0];

  console.log('sending password', options);
  return new Promise(function (ok, ko) {
    try {
      var transporter = _nodemailer2['default'].createTransport({
        service: 'Zoho',
        auth: {
          user: _secretJson2['default'].email.user,
          pass: _secretJson2['default'].email.password
        }
      });

      transporter.sendMail(options, function (error, results) {
        if (error) {
          return ko(error);
        }
        if (results.response === '250 Message received') {
          ok();
        } else {
          ko(new Error(results.response));
        }
      });
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = sendEmail;
module.exports = exports['default'];