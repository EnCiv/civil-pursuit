! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Item/pre/validate',
    'should'
  ];

  module.exports = function test__models__Item__pre__validate (done) {
    var disposable;

    di(done, deps, function (domain, Test, preValidate) {

      function test__models__Item__pre__validate____is_A_Function (done) {

        preValidate.should.be.a.Function;
        done();

      }

      function test__models__Item__pre__validate____callsNext (done) {
        preValidate(done);
      }

      Test([

          test__models__Item__pre__validate____is_A_Function,
          test__models__Item__pre__validate____callsNext

        ], done);

    });
    
  };

} ();
