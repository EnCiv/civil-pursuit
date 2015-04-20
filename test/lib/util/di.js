! function () {
  
  'use strict';

  var should = require('should');

  var Test = require('syn/lib/Test');

  function test__lib__util__di (cb) {
    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      var di;

      function test__lib__util__di____exists (done) {
        di = require('syn/lib/util/di');
        done();
      }

      function test__lib__util__di____is_A_Function (done) {
        di.should.be.a.Function;
        done();
      }

      function test__lib__util__di____passesDependencies (done) {

        var here = require.resolve('syn/package.json')
          .replace(/package\.json$/, '')
          + 'test/lib/util/di';

        di([here], function (di) {
          di.should.be.a.Function;
          di.name.should.be.exactly(test__lib__util__di.name);
          di.proof.should.be.exactly(test__lib__util__di.proof);
          done();
        });

      }

      Test([
          test__lib__util__di____exists,
          test__lib__util__di____is_A_Function,
          test__lib__util__di____passesDependencies
        ], cb);

    });
  }

  test__lib__util__di.proof = true;

  module.exports = test__lib__util__di;

} ();
