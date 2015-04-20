! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'async',
    'should'
  ];

  var should = require('should');

  var Test = require('syn/lib/Test');

  function test__lib__Test (cb) {

    di(cb, deps, function (domain, async) {
      var moduleLibTest;

      function test__lib__Test___Exists (done) {
        moduleLibTest = require('syn/lib/Test');
        done();
      }

      function test__lib__Test___IsA_Function (done) {
        moduleLibTest.should.be.a.Function;
        done();
      }

      function test__lib__Test___Plays_Functions (done) {
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
          test__lib__Test___Exists,
          test__lib__Test___IsA_Function,
          test__lib__Test___Plays_Functions
        ],
        cb);

    });
  }

  module.exports = test__lib__Test;

} ();
