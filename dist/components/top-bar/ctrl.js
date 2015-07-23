/**
 * @package     App.Component.TopbBar.Controller
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppController = require('../../lib/app/controller');

var _libAppController2 = _interopRequireDefault(_libAppController);

var _componentsLoginCtrl = require('../../components/login/ctrl');

var _componentsLoginCtrl2 = _interopRequireDefault(_componentsLoginCtrl);

var _componentsJoinCtrl = require('../../components/join/ctrl');

var _componentsJoinCtrl2 = _interopRequireDefault(_componentsJoinCtrl);

var _componentsForgotPasswordCtrl = require('../../components/forgot-password/ctrl');

var _componentsForgotPasswordCtrl2 = _interopRequireDefault(_componentsForgotPasswordCtrl);

var TopBar = (function (_Controller) {

  /**
   *  @arg    {Object} props
  */

  function TopBar(props) {
    var _this = this;

    _classCallCheck(this, TopBar);

    _get(Object.getPrototypeOf(TopBar.prototype), 'constructor', this).call(this);

    this.props = props;

    this.template = $('.topbar');

    this.store['online users'] = 0;

    this.socket.on('online users', function (num) {
      return _this.set('online users', num);
    });

    this.on('set', function (key, value) {
      if (key === 'online users') {
        _this.renderOnlineUsers();
      }
    });
  }

  _inherits(TopBar, _Controller);

  _createClass(TopBar, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'online users':
          return this.template.find('.online-users');

        case 'right section':
          return this.template.find('.topbar-right');

        case 'login button':
          return this.template.find('.login-button');

        case 'join button':
          return this.template.find('.join-button');

        case 'is in':
          return this.template.find('.is-in');

        case 'is out':
          return this.template.find('.is-out');

        case 'link to profile':
          return $('.link-to-profile', this.template);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.renderOnlineUsers();

      synapp.app.on('set', function (key, value) {
        if (key === 'onlineUsers') {
          _this2.find('online users').text(value);
        }
      });

      this.find('right section').removeClass('hide');

      if (!this.socket.synuser) {
        this.find('login button').on('click', this.loginDialog.bind(this));
        this.find('join button').on('click', this.joinDialog.bind(this));
        this.find('is in').hide();
      } else {
        this.find('is out').remove();
        this.find('is in').css('display', 'inline');
      }
    }
  }, {
    key: 'renderOnlineUsers',
    value: function renderOnlineUsers() {
      this.find('online users').text(this.get('online users'));
    }
  }, {
    key: 'loginDialog',
    value: function loginDialog() {
      var _this3 = this;

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function afterOpen($vexContent) {
          _this3.find('login button').off('click').on('click', function () {
            return vex.close();
          });

          new _componentsLoginCtrl2['default']({ $vexContent: $vexContent });

          $vexContent.find('.forgot-password-link').on('click', function () {
            new _componentsForgotPasswordCtrl2['default']();
            vex.close($vexContent.data().vex.id);
            return false;
          });
        },

        afterClose: function afterClose() {
          $('.login-button').on('click', function () {
            return _this3.loginDialog();
          });
        },

        message: $('#login').text(),

        buttons: [$.extend({}, vex.dialog.buttons.NO, {
          text: 'x Close'
        })]
      });
    }
  }, {
    key: 'joinDialog',
    value: function joinDialog() {
      var _this4 = this;

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      var joinDialog = this.joinDialog.bind(this);

      vex.dialog.confirm({

        afterOpen: function afterOpen($vexContent) {
          _this4.find('join button').off('click').on('click', function () {
            vex.close();
          });

          new _componentsJoinCtrl2['default']({ $vexContent: $vexContent });
        },

        afterClose: function afterClose() {
          $('.join-button').on('click', function () {
            return joinDialog();
          });
        },

        message: $('#join').text(),
        buttons: [$.extend({}, vex.dialog.buttons.NO, {
          text: 'x Close'
        })],
        callback: function callback(value) {},
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    }
  }]);

  return TopBar;
})(_libAppController2['default']);

exports['default'] = TopBar;
module.exports = exports['default'];