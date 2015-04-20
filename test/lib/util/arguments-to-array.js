! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function TestModule_Lib__Util__ArgumentsToArray (done) {

    var humanized = 'Hey i am an example';

    var camel = 'HeyI_AmAnExample';

    var snake = 'Hey_I_Am_An_Example';

    var slug = 'hey-i-am-an-example';

    di(done, deps, function (domain, Test) {

      var argumentsToArray;

      function Module_Lib__Util__ArgumentsToArray_Exists (done) {
        argumentsToArray = require('syn/lib/util/arguments-to-array');
        done();
      }

      function Module_Lib__Util__ArgumentsToArray_IsA_Function (done) {
        argumentsToArray.should.be.a.Function;
        done();
      }

      function Module_Lib__Util__ArgumentsToArray_ReturnsArrayOfArguments (done) {

        function foo () {
          var array = argumentsToArray(arguments);
          
          array.should.be.an.Array;

          array[0].should.be.exactly(1);

          array[1].should.be.exactly('abc');

          done();
        }

        foo(1, 'abc');
      }

      Test([
          Module_Lib__Util__ArgumentsToArray_Exists,
          Module_Lib__Util__ArgumentsToArray_IsA_Function,
          Module_Lib__Util__ArgumentsToArray_ReturnsArrayOfArguments
        ],
        done);

    });

  }

   module.exports = TestModule_Lib__Util__ArgumentsToArray;

} ();
