'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

function setCookieUser(req, res, next) {
  res.cookie('synuser', { email: req.user.email, id: req.user._id }, _synConfigJson2['default'].cookie);

  next();
}

exports['default'] = setCookieUser;
module.exports = exports['default'];