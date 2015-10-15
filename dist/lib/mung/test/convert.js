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

describe('Convert', function () {

  describe('Number', function () {

    describe('to Number', function () {

      var converted = _2['default'].convert(123, Number);

      it('should be a number', function () {

        converted.should.be.a.Number;
      });
    });

    describe('to String', function () {

      var converted = _2['default'].convert(123, String);

      it('should be a string', function () {

        converted.should.be.a.String;
      });
    });

    describe('to Boolean', function () {

      var converted = _2['default'].convert(123, Boolean);

      it('should be a boolean', function () {

        converted.should.be.a.Boolean;
      });
    });
  });

  describe('Array', function () {

    describe('of full models', function () {

      var converted = _2['default'].convert([new Bar({}, { _id: true })], [Bar]);

      console.log(converted);

      it('should be an Array', function () {

        converted.should.be.an.Array();
      });

      it('should be an Array of ObjectIDs', function () {

        converted[0].should.be.an['instanceof'](_2['default'].ObjectID);
      });
    });
  });
});