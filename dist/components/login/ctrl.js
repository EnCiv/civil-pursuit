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

var _libUtilForm = require('../../lib/util/form');

var _libUtilForm2 = _interopRequireDefault(_libUtilForm);

var _libUtilNav = require('../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var Login = (function (_Controller) {
  function Login(props) {
    _classCallCheck(this, Login);

    _get(Object.getPrototypeOf(Login.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.form = new _libUtilForm2['default'](this.template);

    this.form.send(this.submit.bind(this));
  }

  _inherits(Login, _Controller);

  _createClass(Login, [{
    key: 'template',
    get: function () {
      return $('form[name="login"]');
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var _this = this;

      var d = this.domain;

      d.run(function () {
        if ($('.login-error-404').hasClass('is-shown')) {
          return _libUtilNav2['default'].hide($('.login-error-404'), d.intercept(function () {
            // this.send(login);
            _this.form.submit();
          }));
        }

        if ($('.login-error-401').hasClass('is-shown')) {
          return _libUtilNav2['default'].hide($('.login-error-401'), d.intercept(function () {
            // this.send(login);
            _this.form.submit();
          }));
        }

        $.ajax({
          url: '/sign/in',
          type: 'POST',
          data: {
            email: _this.form.labels.email.val(),
            password: _this.form.labels.password.val()
          } }).error(function (response) {
          switch (response.status) {
            case 404:
              _libUtilNav2['default'].show($('.login-error-404'));
              break;

            case 401:
              _libUtilNav2['default'].show($('.login-error-401'));
              break;
          }
        }).success(function (response) {
          _this.reconnect();

          $('a.is-in').css('display', 'inline');

          $('.topbar .is-out').remove();

          vex.close(_this.props.$vexContent.data().vex.id);

          location.href = '/page/profile';
        });
      });
    }
  }]);

  return Login;
})(_libAppController2['default']);

exports['default'] = Login;
module.exports = exports['default'];