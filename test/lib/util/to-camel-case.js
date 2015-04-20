! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function TestModule_Lib__ToCamelCase (done) {

    var human = 'Hey i am an example';

    var camel = 'heyIAmAnExample';

    di(done, deps, function (domain, Test) {

      var toCamelCase;

      function Module_Lib__toCamelCase_Exists (done) {
        toCamelCase = require('syn/lib/util/to-camel-case');
        done();
      }

      function Module_Lib__toCamelCase_IsA_Function (done) {
        toCamelCase.should.be.a.Function;
        done();
      }

      function Module_Lib__toCamelCase_Slugifies (done) {
        toCamelCase(human).should.be.exactly(camel);
        done();
      }

      Test([
          Module_Lib__toCamelCase_Exists,
          Module_Lib__toCamelCase_IsA_Function,
          Module_Lib__toCamelCase_Slugifies
        ],
        done);

    });

  }

   module.exports = TestModule_Lib__ToCamelCase;

} ();
