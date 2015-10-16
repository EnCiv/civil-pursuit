'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

describe('MongoDB Operators', function () {

  describe('Query operators', function () {

    describe('Comparison operators', function () {

      describe('$in', function () {

        var parsed = _2['default'].parse({ foo: { $in: [1, '2'] } }, { foo: Number });

        it('should be an object', function () {

          parsed.should.be.an.Object();
        });

        it('should have property "foo"', function () {

          parsed.should.have.property('foo');
        });

        describe('foo', function () {

          it('should be an object', function () {

            parsed.foo.should.be.an.Object();
          });

          it('should have property "$in"', function () {

            parsed.foo.should.have.property('$in');
          });

          describe('$in', function () {

            it('should be an array', function () {

              parsed.foo.$in.should.be.an.Array();
            });

            it('should have the right length', function () {

              parsed.foo.$in.should.have.length(2);
            });

            it('should have the right item', function () {

              parsed.foo.$in[0].should.be.a.Number().and.is.exactly(1);
              parsed.foo.$in[1].should.be.a.Number().and.is.exactly(2);
            });
          });
        });
      });

      describe('$exists', function () {

        var parsed = _2['default'].parse({ foo: { $exists: true } }, { foo: Number });

        it('should be an object', function () {

          parsed.should.be.an.Object();
        });

        it('should have property "foo"', function () {

          parsed.should.have.property('foo');
        });

        describe('foo', function () {

          it('should be an object', function () {

            parsed.foo.should.be.an.Object();
          });

          it('should have property "$exists"', function () {

            parsed.foo.should.have.property('$exists');
          });

          describe('$exists', function () {

            it('should be an boolean', function () {

              parsed.foo.$exists.should.be.a.Boolean();
            });

            it('should have the right value', function () {

              parsed.foo.$exists.should.be['true'];
            });
          });
        });
      });
    });
  });
});