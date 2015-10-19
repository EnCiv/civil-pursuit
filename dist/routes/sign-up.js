'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domain = require('domain');

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _modelsDiscussion = require('../models/discussion');

var _modelsDiscussion2 = _interopRequireDefault(_modelsDiscussion);

function signUp(req, res, next) {

  try {
    (function () {
      var _req$body = req.body;
      var email = _req$body.email;
      var password = _req$body.password;

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

      _modelsUser2['default'].create({ email: email, password: password }).then(function (user) {
        _modelsDiscussion2['default'].findOne().then(function (discussion) {
          try {
            discussion.registered.push(user._id);
            discussion.save(function (error) {
              if (error) {
                cb(error);
              }
              cb(null, user);
            });
          } catch (error) {
            cb(error);
          }
        }, cb);
      }, cb);
    })();
  } catch (error) {
    next(error);
  }
}

exports['default'] = signUp;
module.exports = exports['default'];