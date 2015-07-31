'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _modelsDiscussion = require('../models/discussion');

var _modelsDiscussion2 = _interopRequireDefault(_modelsDiscussion);

function signIn(req, res, next) {

  try {
    (function () {
      var _req$body = req.body;
      var email = _req$body.email;
      var password = _req$body.password;

      _modelsUser2['default'].identify(email, password).then(function (user) {
        req.user = user;

        _modelsDiscussion2['default'].findOne().exec().then(function (discussion) {
          try {
            if (discussion.registered.some(function (registered) {
              return registered.equals(user._id);
            })) {
              next();
            }

            discussion.registered.push(user._id);

            discussion.save(function (error) {
              if (error) {
                return next(error);
              }
              next();
            });
          } catch (error) {
            next(error);
          }
        }, next);

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