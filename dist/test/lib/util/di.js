'use strict';

!(function () {

  'use strict';

  var should = require('should');

  describe('Lib / Util / Di', function () {

    var di;

    before(function () {

      di = require('syn/lib/util/DI');
    });

    it('should be a function', function () {

      di.should.be.a.Function;
    });

    it('should pass dependencies', function (done) {
      var here = require.resolve('syn/package.json').replace(/package\.json$/, '') + 'test/lib/util/di';

      di([here], function (di) {
        di.should.be.an.Object;
        di.should.have.property('foo').which.is.exactly(1);
        done();
      });
    });
  });

  module.exports = { foo: 1 };
})();