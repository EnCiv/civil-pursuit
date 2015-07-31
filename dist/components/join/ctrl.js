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

var Join = (function (_Controller) {
  function Join(props) {
    _classCallCheck(this, Join);

    _get(Object.getPrototypeOf(Join.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.form = new _libUtilForm2['default'](this.template);

    this.form.send(this.submit.bind(this));

    this.template.find('.i-agree').on('click', function () {

      var agreed = $(this).find('.agreed');

      if (agreed.hasClass('fa-square-o')) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      } else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });

    this.template.find('.join-link_to_login').on('click', function () {
      $('.login-button').click();
    });
  }

  _inherits(Join, _Controller);

  _createClass(Join, [{
    key: 'template',
    get: function () {
      return $('form[name="join"]');
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var _this = this;

      var d = this.domain;

      d.run(function () {

        _this.template.find('.please-agree').addClass('hide');

        _this.template.find('.already-taken').hide();

        if (_this.form.labels.password.val() !== _this.form.labels.confirm.val()) {
          _this.form.labels.confirm.focus().addClass('error');

          return;
        }

        if (!_this.template.find('.agreed').hasClass('fa-check-square-o')) {
          _this.template.find('.please-agree').removeClass('hide');

          return;
        }

        console.info('signing up');

        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: _this.form.labels.email.val(),
            password: _this.form.labels.password.val()
          }
        }).error(function (response, state, code) {
          if (response.status === 401) {
            _this.template.find('.already-taken').show();
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

  return Join;
})(_libAppController2['default']);

exports['default'] = Join;
module.exports = exports['default'];