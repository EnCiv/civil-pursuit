'use strict';

!(function () {

  'use strict';

  var should = require('should');

  var Test = require('syn/lib/Test');

  function onError(error) {
    throw error;
  }

  function test__lib__util__di__domain(cb) {
    var domain = require('domain').create();

    domain.on('error', function (error) {
      cb(error);
    });

    domain.run(function () {

      var di;

      function test__lib__util__di__domain___Exists(done) {
        di = require('syn/lib/util/di/domain');
        done();
      }

      function test__lib__util__di__domain___IsAFunction(done) {
        di.should.be.a.Function;
        done();
      }

      function test__lib__util__di__domain___PassesDependenciesAndDomain(done) {
        var here = require.resolve('syn/package.json').replace(/package\.json$/, '') + 'test/lib/util/di/domain';

        di(onError, [here], function (domain, di) {
          domain.should.be.an['instanceof'](require('domain').Domain);
          di.should.be.a.Function;
          di.name.should.be.exactly(test__lib__util__di__domain.name);
          di.proof.should.be.exactly(test__lib__util__di__domain.proof);
          done();
        });
      }

      function test__lib__util__di__domain___CatchesErrors(done) {
        di(function (error) {
          done();
        }, [], function () {
          throw new Error('Expected error');
        });
      }

      Test([test__lib__util__di__domain___Exists, test__lib__util__di__domain___IsAFunction, test__lib__util__di__domain___PassesDependenciesAndDomain, test__lib__util__di__domain___CatchesErrors], cb);
    });
  }

  test__lib__util__di__domain.proof = true;

  module.exports = test__lib__util__di__domain;
})();