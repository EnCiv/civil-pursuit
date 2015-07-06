'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configJson = require('../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

function setCookieUser(req, res, next) {
  res.cookie('synuser', { email: req.user.email, id: req.user._id }, _configJson2['default'].cookie);

  next();
}

exports['default'] = setCookieUser;
module.exports = exports['default'];