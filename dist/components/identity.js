'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _utilInputGroup = require('./util/input-group');

var _utilInputGroup2 = _interopRequireDefault(_utilInputGroup);

var _utilTextInput = require('./util/text-input');

var _utilTextInput2 = _interopRequireDefault(_utilTextInput);

var _utilSelect = require('./util/select');

var _utilSelect2 = _interopRequireDefault(_utilSelect);

var _utilDateInput = require('./util/date-input');

var _utilDateInput2 = _interopRequireDefault(_utilDateInput);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

var Identity = (function (_React$Component) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Identity(props) {
    _classCallCheck(this, Identity);

    _get(Object.getPrototypeOf(Identity.prototype), 'constructor', this).call(this, props);

    var _props = this.props;
    var user = _props.user;
    var countries = _props.countries;
    var config = _props.config;

    this.state = { user: user, countries: countries, config: config };
  }

  _inherits(Identity, _React$Component);

  _createClass(Identity, [{
    key: 'saveImage',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveImage(file) {
      window.socket.emit('save user image', file.name);
    }
  }, {
    key: 'saveFirstName',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveFirstName() {
      var firstName = _react2['default'].findDOMNode(this.refs.firstName).value;

      if (firstName) {
        window.socket.emit('set first name', firstName);
      }
    }
  }, {
    key: 'saveMiddleName',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveMiddleName() {
      var middleName = _react2['default'].findDOMNode(this.refs.middleName).value;

      if (middleName) {
        window.socket.emit('set middle name', middleName);
      }
    }
  }, {
    key: 'saveLastName',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveLastName() {
      var lastName = _react2['default'].findDOMNode(this.refs.lastName).value;

      if (lastName) {
        window.socket.emit('set last name', lastName);
      }
    }
  }, {
    key: 'saveGender',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveGender() {
      var gender = _react2['default'].findDOMNode(this.refs.gender).value;

      if (gender) {
        window.socket.emit('set gender', gender);
      }
    }
  }, {
    key: 'saveBirthdate',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveBirthdate() {
      var birthdate = _react2['default'].findDOMNode(this.refs.birthdate).value;

      if (birthdate) {
        var dob = new Date(birthdate);
        var now = Date.now();

        if (now > dob) {
          window.socket.emit('set birthdate', dob);
        }
      }
    }
  }, {
    key: 'saveCitizenship',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveCitizenship(e) {
      var _this = this;

      var citizenship = _react2['default'].findDOMNode(this.refs.citizenship).value;

      if (citizenship) {
        window.socket.emit('set citizenship', citizenship, 0).on('OK set citizenship', function (user) {
          _this.setState({ user: user });
        });
      }
    }
  }, {
    key: 'saveDualCitizenship',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function saveDualCitizenship(e) {
      var _this2 = this;

      var dualCitizenship = _react2['default'].findDOMNode(this.refs.dualCitizenship).value;

      if (dualCitizenship) {
        window.socket.emit('set citizenship', dualCitizenship, 1).on('OK set citizenship', function (user) {
          _this2.setState({ user: user });
        });
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var _state = this.state;
      var user = _state.user;
      var countries = _state.countries;
      var config = _state.config;

      var citizenship = '',
          dualCitizenship = '';

      if (user.citizenship) {

        if (user.citizenship[0]) {
          citizenship = user.citizenship[0];
        }

        if (user.citizenship[1]) {
          dualCitizenship = user.citizenship[1];
        }
      }

      var countryOptions1 = countries.filter(function (country) {
        return country._id !== dualCitizenship;
      }).map(function (country) {
        return _react2['default'].createElement(
          'option',
          { value: country._id, key: country._id },
          country.name
        );
      });

      var countryOptions2 = countries.filter(function (country) {
        return country._id !== citizenship;
      }).map(function (country) {
        return _react2['default'].createElement(
          'option',
          { value: country._id, key: country._id },
          country.name
        );
      });

      var dobValue = undefined;

      if (user.dob) {
        var dob = new Date(user.dob);

        var dob_year = dob.getFullYear();
        var dob_month = dob.getMonth() + 1;
        var dob_day = dob.getDate() + 1;

        if (dob_month < 10) {
          dob_month = '0' + dob_month;
        }

        if (dob_day < 10) {
          dob_day = '0' + dob_day;
        }

        dobValue = [dob_year, dob_month, dob_day].join('-');
      }

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          _utilRow2['default'],
          null,
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', className: 'gutter' },
            _react2['default'].createElement(_uploader2['default'], { handler: this.saveImage.bind(this), image: user.image })
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', className: 'gutter' },
            _react2['default'].createElement(
              'h2',
              null,
              'Identity'
            ),
            _react2['default'].createElement(
              'p',
              null,
              'This information is used to identify you and make sure that you are unique.'
            )
          )
        ),
        _react2['default'].createElement(
          'section',
          { className: 'gutter' },
          _react2['default'].createElement(
            _utilInputGroup2['default'],
            { block: true },
            _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'First name', onChange: this.saveFirstName.bind(this), ref: 'firstName', defaultValue: user.first_name }),
            _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'Middle name', onChange: this.saveMiddleName.bind(this), ref: 'middleName', defaultValue: user.middle_name }),
            _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'Last name', onChange: this.saveLastName.bind(this), ref: 'lastName', defaultValue: user.last_name })
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            { baseline: true, className: 'gutter-y' },
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '25' },
              'Citizenship'
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '75' },
              _react2['default'].createElement(
                _utilSelect2['default'],
                { block: true, medium: true, onChange: this.saveCitizenship.bind(this), ref: 'citizenship', defaultValue: citizenship },
                _react2['default'].createElement(
                  'option',
                  { value: '' },
                  'Choose one'
                ),
                countryOptions1
              )
            )
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            { baseline: true, className: 'gutter-y' },
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '25' },
              'Dual citizenship'
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '75' },
              _react2['default'].createElement(
                _utilSelect2['default'],
                { block: true, medium: true, onChange: this.saveDualCitizenship.bind(this), ref: 'dualCitizenship', defaultValue: dualCitizenship },
                _react2['default'].createElement(
                  'option',
                  { value: '' },
                  'Choose one'
                ),
                countryOptions2
              )
            )
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            { baseline: true, className: 'gutter-y' },
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '25' },
              'Birthdate'
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '75' },
              _react2['default'].createElement(_utilDateInput2['default'], { block: true, medium: true, ref: 'birthdate', onChange: this.saveBirthdate.bind(this), defaultValue: dobValue })
            )
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            { baseline: true, className: 'gutter-y' },
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '25' },
              'Gender'
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '75' },
              _react2['default'].createElement(
                _utilSelect2['default'],
                { block: true, medium: true, ref: 'gender', onChange: this.saveGender.bind(this), defaultValue: user.gender },
                _react2['default'].createElement(
                  'option',
                  { value: '' },
                  'Choose one'
                ),
                _react2['default'].createElement(
                  'option',
                  { value: 'M' },
                  'Male'
                ),
                _react2['default'].createElement(
                  'option',
                  { value: 'F' },
                  'Female'
                ),
                _react2['default'].createElement(
                  'option',
                  { value: 'O' },
                  'Other'
                )
              )
            )
          )
        )
      );
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Identity;
})(_react2['default'].Component);

exports['default'] = Identity;
module.exports = exports['default'];