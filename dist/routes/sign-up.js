'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domain = require('domain');

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function signUp(req, res, next) {

  try {
    var _req$body = req.body;
    var email = _req$body.email;
    var password = _req$body.password;

    var d = new _domain.Domain().on('error', next);

    var cb = function cb(error, user) {
      if (error) {
        if (/duplicate key/.test(error.message)) {
          res.statusCode = 401;
          res.json({ error: 'username exists' });
        } else {
          next(error);
        }
      } else {
        req.user = user;

        next();
      }
    };

    _modelsUser2['default'].create({ email: email, password: password }, d.bind(cb));
  } catch (error) {
    next(error);
  }
}

exports['default'] = signUp;
module.exports = exports['default'];