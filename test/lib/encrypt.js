! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/lib/encrypt',
    'should'
  ];

  module.exports = function test__lib__encrypt (done) {

    var str = 'Hello this a test 1234 /ñ';

    di(done, deps, function (domain, Test, encrypt) {

      function test__lib__encrypt____is_A_Function (done) {
        encrypt.should.be.a.Function;
        done();
      }

      function test__lib__encrypt____encrypts (done) {
        encrypt(str, domain.intercept(function (encrypted) {
          encrypted.should.be.a.String;
          encrypted.should.not.be.exactly(str);  
        }));
      }

      Test([

          test__lib__encrypt____is_A_Function,
          test__lib__encrypt____encrypts

        ], done);

    });
    
  };

} ();
