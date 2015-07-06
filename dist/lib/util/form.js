'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _synLibUtilDomainRun = require('syn/lib/util/domain-run');

var _synLibUtilDomainRun2 = _interopRequireDefault(_synLibUtilDomainRun);

var Form = (function () {
  function Form(form) {
    var _this = this;

    _classCallCheck(this, Form);

    var self = this;

    this.form = form;

    this.labels = {};

    form.find('[name]').each(function () {
      self.labels[$(this).attr('name')] = $(this);
    });

    // #193 Disable <Enter> keys

    form.find('input').on('keydown', function (e) {
      if (e.keyCode === 13) {
        return false;
      }
    });

    form.on('submit', function (e) {
      setTimeout(function () {
        return _this.submit(e);
      });
      return false;
    });
  }

  _createClass(Form, [{
    key: 'send',
    value: function send(fn) {
      this.ok = fn;
      return this;
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var errors = [];

      this.form.find('[required]').each(function () {
        var val = $(this).val();

        if (!val) {

          if (!errors.length) {
            $(this).addClass('error').focus();
          }

          errors.push({ required: $(this).attr('name') });
        } else {
          $(this).removeClass('error');
        }
      });

      if (!errors.length) {
        this.ok();
      }

      return false;
    }
  }]);

  return Form;
})();

exports['default'] = Form;
module.exports = exports['default'];