! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'async',
    'should'
  ];

  var should = require('should');

  var Test = require('syn/lib/Test');

  function TestModule_Lib__Test (cb) {

    di(cb, deps, function (domain, async) {
      var moduleLibTest;

      function Module_Lib__Test_Exists (done) {
        moduleLibTest = require('syn/lib/Test');
        done();
      }

      function Module_Lib__Test_IsA_Function (done) {
        moduleLibTest.should.be.a.Function;
        done();
      }

      function Module_Lib__Test_Plays_Functions (done) {
        var i = 0;

        moduleLibTest([
            function Sum1 (done) {
              i ++;
              done();
            },

            function Sum2 (done) {
              i ++;
              done();
            }
          ], domain.intercept(function (results) {
            i.should.be.exactly(2);
            done();
          }));
      }

      async.series([
          Module_Lib__Test_Exists,
          Module_Lib__Test_IsA_Function,
          Module_Lib__Test_Plays_Functions
        ],
        cb);

    });
  }

  module.exports = TestModule_Lib__Test;

} ();
