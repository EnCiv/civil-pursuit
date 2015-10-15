'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var Foo = (function (_Mung$Model) {
  function Foo() {
    _classCallCheck(this, Foo);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Foo, _Mung$Model);

  return Foo;
})(_2['default'].Model);

;

describe('Schema', function () {

  var schema = Foo.getSchema();

  it('should be an object', function () {

    schema.should.be.an.Object();
  });

  describe('_id', function () {

    it('should exist', function () {

      schema.should.have.property('_id');
    });

    it('should be ObjectID', function () {

      schema._id.should.be.exactly(_2['default'].ObjectID);
    });
  });

  describe('__v (document version)', function () {

    it('should exist', function () {

      schema.should.have.property('__v');
    });

    it('should be Number', function () {

      schema.__v.should.be.exactly(Number);
    });
  });

  describe('__V (model version)', function () {

    it('should exist', function () {

      schema.should.have.property('__V');
    });

    it('should be Number', function () {

      schema.__V.should.be.exactly(Number);
    });
  });
});