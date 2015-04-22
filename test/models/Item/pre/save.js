! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Item/pre/save',
    'should'
  ];

  module.exports = function test__models__Item__pre__save (done) {
    var disposable;

    di(done, deps, function (domain, Test, preSave) {

      function test__models__Item__pre__save____is_A_Function (done) {

        preSave.should.be.a.Function;
        done();

      }

      function test__models__Item__pre__save____callsNext (done) {
        done();
      }

      Test([

          test__models__Item__pre__save____is_A_Function,
          test__models__Item__pre__save____callsNext

        ], done);

    });
    
  };

} ();
