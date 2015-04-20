! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function TestModule_Lib__Util__Ls (done) {

    di(done, deps, function (domain, Test) {

      var ls;

      function Module_Lib__Util__Ls_Exists (done) {
        ls = require('syn/lib/util/ls');
        done();
      }

      function Module_Lib__Util__Ls_IsA_Function (done) {
        ls.should.be.a.Function;
        done();
      }

      function Module_Lib__Util__Ls_ReturnsAnObject (done) {
        di(done, ['async'], function (domain) {
          ls(__dirname, domain.intercept(function (ls) {
            ls.should.be.an.Object;
            done();
          }));
        });
      }

      Test([
          Module_Lib__Util__Ls_Exists,
          Module_Lib__Util__Ls_IsA_Function,
          Module_Lib__Util__Ls_ReturnsAnObject
        ],
        done);

    });

  }

   module.exports = TestModule_Lib__Util__Ls;

} ();
