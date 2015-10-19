'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libMung = require('../../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var _race = require('../race');

var _race2 = _interopRequireDefault(_race);

var _maritalStatus = require('../marital-status');

var _maritalStatus2 = _interopRequireDefault(_maritalStatus);

var _employment = require('../employment');

var _employment2 = _interopRequireDefault(_employment);

var _education = require('../education');

var _education2 = _interopRequireDefault(_education);

var _politicalParty = require('../political-party');

var _politicalParty2 = _interopRequireDefault(_politicalParty);

var _country = require('../country');

var _country2 = _interopRequireDefault(_country);

var _state = require('../state');

var _state2 = _interopRequireDefault(_state);

var _staticsEncryptPassword = require('./statics/encrypt-password');

var _staticsEncryptPassword2 = _interopRequireDefault(_staticsEncryptPassword);

var _staticsLowerEmail = require('./statics/lower-email');

var _staticsLowerEmail2 = _interopRequireDefault(_staticsLowerEmail);

var _staticsIdentify = require('./statics/identify');

var _staticsIdentify2 = _interopRequireDefault(_staticsIdentify);

var _staticsIsPasswordValid = require('./statics/is-password-valid');

var _staticsIsPasswordValid2 = _interopRequireDefault(_staticsIsPasswordValid);

var _methodsReactivate = require('./methods/reactivate');

var _methodsReactivate2 = _interopRequireDefault(_methodsReactivate);

var _methodsAddRace = require('./methods/add-race');

var _methodsAddRace2 = _interopRequireDefault(_methodsAddRace);

var _migrations2 = require('./migrations/2');

var _migrations22 = _interopRequireDefault(_migrations2);

var User = (function (_Mung$Model) {
  function User() {
    _classCallCheck(this, User);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(User, _Mung$Model);

  _createClass(User, [{
    key: 'reactivate',
    value: function reactivate() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _methodsReactivate2['default'].apply(this, args);
    }
  }, {
    key: 'addRace',
    value: function addRace() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _methodsAddRace2['default'].apply(this, args);
    }
  }], [{
    key: 'schema',
    value: function schema() {
      return {
        'email': {
          'type': String,
          'required': true,
          'unique': true
        },

        'password': {
          'type': String,
          'required': true
        },

        'image': String,

        'preferences': [{
          'name': String,
          'value': _libMung2['default'].Mixed
        }],

        'twitter': String,

        'facebook': String,

        'first_name': String,

        'middle_name': String,

        'last_name': String,

        'gps': {
          type: [Number],
          index: '2d'
        },

        'gps validated': Date,

        'activation_key': String,

        'activation_token': String,

        'race': [_race2['default']],

        'gender': {
          'type': String,
          'validate': function validate(value) {
            return ['M', 'F', 'O'].indexOf(value) > -1;
          }
        },

        'married': _maritalStatus2['default'],

        'employment': _employment2['default'],

        'education': _education2['default'],

        'citizenship': [_country2['default']],

        'dob': Date,

        'registered_voter': Boolean,

        'party': _politicalParty2['default'],

        'city': String,

        'state': _state2['default'],

        'zip': String,

        'zip4': String
      };
    }
  }, {
    key: 'inserting',
    value: function inserting() {
      return [this.encryptPassword.bind(this), this.lowerEmail.bind(this)];
    }
  }]);

  return User;
})(_libMung2['default'].Model);

User.encryptPassword = _staticsEncryptPassword2['default'].bind(User);
User.lowerEmail = _staticsLowerEmail2['default'].bind(User);
User.identify = _staticsIdentify2['default'].bind(User);
User.isPasswordValid = _staticsIsPasswordValid2['default'].bind(User);

User.version = 2;

User.migrations = {
  2: _migrations22['default']
};

exports['default'] = User;
module.exports = exports['default'];