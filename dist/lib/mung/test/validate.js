'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _String = (function () {
  function _String() {
    _classCallCheck(this, _String);
  }

  _createClass(_String, null, [{
    key: 'validate',
    value: function validate(value) {
      return typeof value === 'string';
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      return String(value);
    }
  }]);

  return _String;
})();

var _Number = (function () {
  function _Number() {
    _classCallCheck(this, _Number);
  }

  _createClass(_Number, null, [{
    key: 'validate',
    value: function validate(value) {
      return value.constructor === Number && isFinite(value);
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      return +value;
    }
  }]);

  return _Number;
})();

var _Boolean = (function () {
  function _Boolean() {
    _classCallCheck(this, _Boolean);
  }

  _createClass(_Boolean, null, [{
    key: 'validate',
    value: function validate(value) {
      return typeof value === 'boolean';
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      return !!value;
    }
  }]);

  return _Boolean;
})();

var _Object = (function () {
  function _Object() {
    _classCallCheck(this, _Object);
  }

  _createClass(_Object, null, [{
    key: 'validate',
    value: function validate(value) {
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
  }]);

  return _Object;
})();

var _Mixed = (function () {
  function _Mixed() {
    _classCallCheck(this, _Mixed);
  }

  _createClass(_Mixed, null, [{
    key: 'validate',
    value: function validate(value) {
      return true;
    }
  }]);

  return _Mixed;
})();

function validate(value, type) {
  var convert = arguments[2] === undefined ? false : arguments[2];

  if (Array.isArray(type)) {
    if (!Array.isArray(value)) {
      return false;
    }

    if (type.length === 1) {
      return value.map(function (value) {
        return validate(value, type[0], convert);
      }).every(function (value) {
        return value;
      });
    } else if (value.length !== type.length) {
      return false;
    } else {
      return value.map(function (value, index) {
        return validate(value, type[index], convert);
      }).every(function (value) {
        return value;
      });
    }
  }

  if (type === String) {
    type = _String;
  } else if (type === Number) {
    type = _Number;
  } else if (type === Boolean) {
    type = _Boolean;
  } else if (type === Object) {
    type = _Object;
  }

  if (convert && type.convert) {
    value = type.convert(value);
  }

  return type.validate(value);
}

validate('hello', String).should.be['true'];

validate(123, String).should.be['false'];
validate(123, String, true).should.be['true'];

validate(/abc/, String).should.be['false'];
validate(/abc/, String, true).should.be['true'];

validate(true, String).should.be['false'];
validate(true, String, true).should.be['true'];

validate(null, String).should.be['false'];
validate(null, String, true).should.be['true'];

validate([1, true], String).should.be['false'];
validate([1, true], String, true).should.be['true'];

validate({}, String).should.be['false'];
validate({}, String, true).should.be['true'];

validate(['a'], [String]).should.be['true'];
validate(['a', 'b', 'c'], [String]).should.be['true'];
validate(['a', 'b', 'c', 1], [String]).should.be['false'];
validate(['a', 'b', 'c', 1], [String], true).should.be['true'];

validate([0, 1, null, false, {}], [String]).should.be['false'];
validate([0, 1, null, false, {}], [String], true).should.be['true'];

validate([0, 'a'], [Number, String]).should.be['true'];

validate(1, Number).should.be['true'];
validate('a', Number).should.be['false'];
validate('a', Number, true).should.be['false'];
validate('1', Number, true).should.be['true'];
validate(true, Number).should.be['false'];
validate(true, Number, true).should.be['true'];

validate(true, Boolean).should.be['true'];
validate(false, Boolean).should.be['true'];
validate(0, Boolean).should.be['false'];
validate(0, Boolean, true).should.be['true'];

validate({}, Object).should.be['true'];
validate('hello', Object).should.be['false'];
validate([], Object).should.be['false'];

validate([], _Mixed).should.be['true'];
validate(1, _Mixed).should.be['true'];
validate('a', _Mixed).should.be['true'];
validate(null, _Mixed).should.be['true'];
validate({}, _Mixed).should.be['true'];