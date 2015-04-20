! function () {
  
  'use strict';

  var should = require('should');

  var Test = require('syn/lib/Test');

  function onError (error) {
    throw error;
  }

  function TestModule_Lib__Util__Di__Domain (cb) {
    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      var di;

      function Module_Lib__Util__Di__Domain_Exists (done) {
        di = require('syn/lib/util/di/domain');
        done();
      }

      function Module_Lib__Util__Di__Domain_IsAFunction (done) {
        di.should.be.a.Function;
        done();
      }

      function Module_Lib__Util__Di__Domain_PassesDependenciesAndDomain (done) {
        var here = require.resolve('syn/package.json')
          .replace(/package\.json$/, '')
          + 'test/lib/util/di/domain';

        di(onError, [here], function (domain, di) {
          domain.should.be.an.instanceof(require('domain').Domain);
          di.should.be.a.Function;
          di.name.should.be.exactly(TestModule_Lib__Util__Di__Domain.name);
          di.proof.should.be.exactly(TestModule_Lib__Util__Di__Domain.proof);
          done();
        });
      }

      function Module_Lib__Util__Di__Domain_CatchesErrors (done) {
        di(function (error) {
          done();
        }, [], function () {
          throw new Error('Expected error');
        });
      }

      Test([

          Module_Lib__Util__Di__Domain_Exists,
          Module_Lib__Util__Di__Domain_IsAFunction,
          Module_Lib__Util__Di__Domain_PassesDependenciesAndDomain,
          Module_Lib__Util__Di__Domain_CatchesErrors

        ], cb);

    });

  }

  TestModule_Lib__Util__Di__Domain.proof = true;

  module.exports = TestModule_Lib__Util__Di__Domain;

} ();
