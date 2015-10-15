'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var Bar = (function (_Mung$Model) {
  function Bar() {
    _classCallCheck(this, Bar);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Bar, _Mung$Model);

  _createClass(Bar, null, [{
    key: 'schema',
    value: function schema() {
      return {
        string: String
      };
    }
  }]);

  return Bar;
})(_2['default'].Model);

var Foo = (function (_Mung$Model2) {
  function Foo() {
    _classCallCheck(this, Foo);

    if (_Mung$Model2 != null) {
      _Mung$Model2.apply(this, arguments);
    }
  }

  _inherits(Foo, _Mung$Model2);

  return Foo;
})(_2['default'].Model);

describe('Mung', function () {

  describe('CRUD Operations', function () {

    describe('Find', function () {

      describe('Find by ids', function () {});
    });
  });
});

// it ('should translate to a $in operator', function () {
//
//   Mung.findByIds()
//
// });