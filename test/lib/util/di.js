! function () {
  
  'use strict';

  var should = require('should');

  var Test = require('syn/lib/Test');

  function TestModule_Lib__Util__Di (cb) {
    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      var di;

      function Module_Lib__Util__DI_Exists (done) {
        di = require('syn/lib/util/di');
        done();
      }

      function Module_Lib__Util__DI_IsA_Function (done) {
        di.should.be.a.Function;
        done();
      }

      function Module_Lib__Util__DI_PassesDependencies (done) {

        var here = require.resolve('syn/package.json')
          .replace(/package\.json$/, '')
          + 'test/lib/util/di';

        di([here], function (di) {
          di.should.be.a.Function;
          di.name.should.be.exactly(TestModule_Lib__Util__Di.name);
          di.proof.should.be.exactly(TestModule_Lib__Util__Di.proof);
          done();
        });

      }

      Test([Module_Lib__Util__DI_Exists, Module_Lib__Util__DI_IsA_Function, Module_Lib__Util__DI_PassesDependencies], cb);

    });
  }

  TestModule_Lib__Util__Di.proof = true;

  module.exports = TestModule_Lib__Util__Di;

} ();
