'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flash = require('./flash');

var _flash2 = _interopRequireDefault(_flash);

var _libAppComponent = require('../../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var Form = (function (_React$Component) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Form(props) {
    _classCallCheck(this, Form);

    _get(Object.getPrototypeOf(Form.prototype), 'constructor', this).call(this, props);

    var _ref = this.props.flash || {};

    var validationError = _ref.validationError;
    var successMessage = _ref.successMessage;

    this.state = {
      validationError: validationError, successMessage: successMessage
    };
  }

  _inherits(Form, _React$Component);

  _createClass(Form, [{
    key: 'componentWillReceiveProps',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentWillReceiveProps(props) {
      if ('flash' in props && props.flash) {
        if ('validationError' in props.flash) {
          this.setState({ validationError: props.flash.validationError });
        }

        if ('successMessage' in props.flash) {
          this.setState({ successMessage: props.flash.successMessage });
        }
      }
    }
  }, {
    key: 'validateRequired',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function validateRequired() {
      var form = _react2['default'].findDOMNode(this.refs.form);

      var requiredList = form.querySelectorAll('[required]');

      var empty = [];

      for (var i = 0; i < requiredList.length; i++) {
        var value = requiredList[i].value;

        if (!value) {
          empty.push(requiredList[i]);
        }
      }

      if (empty.length) {
        this.setState({ validationError: '' + empty[0].placeholder + ' ' + Form.REQUIRED_MESSAGE });

        empty[0].select();

        return false;
      }

      return true;
    }
  }, {
    key: 'validateEmail',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function validateEmail() {
      var form = _react2['default'].findDOMNode(this.refs.form);

      var emails = form.querySelectorAll('[type="email"]');

      var invalid = [];

      for (var i = 0; i < emails.length; i++) {
        var value = emails[i].value;

        if (!emails[i].checkValidity()) {
          invalid.push(emails[i]);
        }
      }

      if (invalid.length) {
        this.setState({ validationError: '' + invalid[0].placeholder + ' must be a valid email address' });

        invalid[0].select();

        return false;
      }

      return true;
    }
  }, {
    key: 'submitHandler',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function submitHandler(e) {
      e.preventDefault();

      if (this.validateRequired() && this.validateEmail()) {
        this.setState({ validationError: null });
        if (this.props.handler) {
          this.props.handler(e);
        }
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var flash = undefined;

      if (this.state.validationError) {
        flash = _react2['default'].createElement(_flash2['default'], { error: true, message: this.state.validationError });
      } else if (this.state.successMessage) {
        flash = _react2['default'].createElement(_flash2['default'], { success: true, message: this.state.successMessage });
      }

      var classes = [];

      if (this.props['form-center']) {
        classes.push('syn-form-center');
      }

      return _react2['default'].createElement(
        'form',
        _extends({}, this.props, { method: 'POST', role: 'form', noValidate: true, onSubmit: this.submitHandler.bind(this), ref: 'form', className: _libAppComponent2['default'].classList.apply(_libAppComponent2['default'], [this].concat(classes)) }),
        _react2['default'].createElement(
          'h2',
          null,
          this.props.title
        ),
        flash,
        this.props.children
      );
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Form;
})(_react2['default'].Component);

Form.REQUIRED_MESSAGE = 'can not be left empty';

exports['default'] = Form;
module.exports = exports['default'];