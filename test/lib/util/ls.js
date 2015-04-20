! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function test__lib__util__ls (done) {

    di(done, deps, function (domain, Test) {

      var ls;

      function test__lib__util__ls____Exists (done) {
        ls = require('syn/lib/util/ls');
        done();
      }

      function test__lib__util__ls____IsA_Function (done) {
        ls.should.be.a.Function;
        done();
      }

      function test__lib__util__ls____ReturnsAnObject (done) {
        di(done, ['async'], function (domain) {
          ls(__dirname, domain.intercept(function (ls) {
            ls.should.be.an.Object;
            done();
          }));
        });
      }

      Test([
          test__lib__util__ls____Exists,
          test__lib__util__ls____IsA_Function,
          test__lib__util__ls____ReturnsAnObject
        ],
        done);

    });

  }

   module.exports = test__lib__util__ls;

} ();
