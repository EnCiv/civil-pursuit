'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function signIn(req, res, next) {

  try {
    (function () {
      var _req$body = req.body;
      var email = _req$body.email;
      var password = _req$body.password;

      console.log('signing in', email, password);

      _modelsUser2['default'].identify(email, password).then(function (user) {
        req.user = user;
        next();
      }, function (error) {
        console.log('error', error);

        if (/^User not found/.test(error.message)) {
          res.statusCode = 404;
          res.json({ 'user not found': email });
        } else if (/^Wrong password/.test(error.message)) {
          res.statusCode = 401;
          res.json({ 'user not found': email });
        } else {
          next(error);
        }
      });
    })();
  } catch (error) {
    next(error);
  }
}

exports['default'] = signIn;
module.exports = exports['default'];