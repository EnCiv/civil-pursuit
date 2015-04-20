! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function test__lib__util__toCamelCase (done) {

    var human = 'Hey i am an example';

    var camel = 'heyIAmAnExample';

    di(done, deps, function (domain, Test) {

      var toCamelCase;

      function test__lib__util__toCamelCase____Exists (done) {
        toCamelCase = require('syn/lib/util/to-camel-case');
        done();
      }

      function test__lib__util__toCamelCase____IsA_Function (done) {
        toCamelCase.should.be.a.Function;
        done();
      }

      function test__lib__util__toCamelCase____Slugifies (done) {
        toCamelCase(human).should.be.exactly(camel);
        done();
      }

      Test([
          test__lib__util__toCamelCase____Exists,
          test__lib__util__toCamelCase____IsA_Function,
          test__lib__util__toCamelCase____Slugifies
        ],
        done);

    });

  }

   module.exports = test__lib__util__toCamelCase;

} ();
