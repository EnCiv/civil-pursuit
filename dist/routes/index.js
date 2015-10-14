'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export homePage           from './home';
// export signIn             from './sign-in';
// export setUserCookie      from './set-user-cookie';

var _home = require('./home');

var _home2 = _interopRequireDefault(_home);

var _signIn = require('./sign-in');

var _signIn2 = _interopRequireDefault(_signIn);

var _setUserCookie = require('./set-user-cookie');

var _setUserCookie2 = _interopRequireDefault(_setUserCookie);

exports.homePage = _home2['default'];
exports.signIn = _signIn2['default'];
exports.setUserCookie = _setUserCookie2['default'];