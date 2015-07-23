'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _configJson = require('../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _libAppPage = require('../../lib/app/page');

var _libAppPage2 = _interopRequireDefault(_libAppPage);

var TopBar = (function (_Element) {
  function TopBar(props) {
    _classCallCheck(this, TopBar);

    _get(Object.getPrototypeOf(TopBar.prototype), 'constructor', this).call(this, '.topbar');
    this.props = props || {};

    this.add(this.rightButtons(), this.logo());
  }

  _inherits(TopBar, _Element);

  _createClass(TopBar, [{
    key: 'rightButtons',
    value: function rightButtons() {
      return new _cincoDist.Element('.topbar-right.hide').add(this.onlineNow(), this.loginButton(), this.profileLink(), this.signOutLink(), this.joinButton());
    }
  }, {
    key: 'onlineNow',
    value: function onlineNow() {
      return new _cincoDist.Element('button.online-now').add(new _cincoDist.Element('span').text('Online now: '), new _cincoDist.Element('span.online-users'));
    }
  }, {
    key: 'loginButton',
    value: function loginButton() {
      return new _cincoDist.Element('button.is-out.login-button').condition(!this.props.user).add(new _cincoDist.Element('b').text('Login'));
    }
  }, {
    key: 'profileLink',
    value: function profileLink() {
      return new _cincoDist.Element('a.button.is-in.link-to-profile', {
        href: (0, _libAppPage2['default'])('Profile'),
        title: 'Profile'
      }).add(new _cincoDist.Element('i.fa.fa-user'));
    }
  }, {
    key: 'signOutLink',
    value: function signOutLink() {
      return new _cincoDist.Element('a.button.is-in', {
        href: (0, _libAppPage2['default'])('Sign Out'),
        title: 'Sign out'
      }).add(new _cincoDist.Element('i.fa.fa-sign-out'));
    }
  }, {
    key: 'joinButton',
    value: function joinButton() {
      return new _cincoDist.Element('button.is-out.join-button').condition(!this.props.user).add(new _cincoDist.Element('b').text('Join'));
    }
  }, {
    key: 'logo',
    value: function logo() {
      return new _cincoDist.Element('#logo').add(this.logoLink(), this.beta());
    }
  }, {
    key: 'logoLink',
    value: function logoLink() {
      return new _cincoDist.Element('a.pull-left', {
        href: '/',
        'date-toggle': 'tooltip',
        'data-placement': 'bottom',
        'title': 'Synaccord'
      }).add(new _cincoDist.Element('img.img-responsive.logo-full', {
        alt: 'Synapp',
        src: 'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_name_300x61_xyohja.png'
      }), new _cincoDist.Element('img.img-responsive.logo-image.hide', {
        alt: 'Synapp',
        src: 'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_64x61_znpxlc.png'
      }));
    }
  }, {
    key: 'beta',
    value: function beta() {
      return new _cincoDist.Element('a.beta', { href: '/' }).text('Beta');
    }
  }]);

  return TopBar;
})(_cincoDist.Element);

exports['default'] = TopBar;
module.exports = exports['default'];