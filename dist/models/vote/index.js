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

var _user = require('../user');

var _user2 = _interopRequireDefault(_user);

var _item = require('../item');

var _item2 = _interopRequireDefault(_item);

var _criteria = require('../criteria');

var _criteria2 = _interopRequireDefault(_criteria);

var Vote = (function (_Mung$Model) {
  function Vote() {
    _classCallCheck(this, Vote);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Vote, _Mung$Model);

  _createClass(Vote, null, [{
    key: 'schema',
    value: function schema() {
      return {
        'item': {
          'type': _item2['default'],
          'required': true
        },
        'criteria': {
          'type': _criteria2['default'],
          'required': true
        },
        'user': {
          'type': _user2['default'],
          'required': true
        },
        'value': {
          'type': Number,
          'required': true
        }
      };
    }
  }]);

  return Vote;
})(_libMung2['default'].Model);

exports['default'] = Vote;
module.exports = exports['default'];