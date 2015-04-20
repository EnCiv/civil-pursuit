! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function test__lib__util__argumentsToArray (done) {

    var humanized = 'Hey i am an example';

    var camel = 'HeyI_AmAnExample';

    var snake = 'Hey_I_Am_An_Example';

    var slug = 'hey-i-am-an-example';

    di(done, deps, function (domain, Test) {

      var argumentsToArray;

      function test__lib__util__argumentsToArray____Exists (done) {
        argumentsToArray = require('syn/lib/util/arguments-to-array');
        done();
      }

      function test__lib__util__argumentsToArray____IsA_Function (done) {
        argumentsToArray.should.be.a.Function;
        done();
      }

      function test__lib__util__argumentsToArray____ReturnsArrayOfArguments (done) {

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
          test__lib__util__argumentsToArray____Exists,
          test__lib__util__argumentsToArray____IsA_Function,
          test__lib__util__argumentsToArray____ReturnsArrayOfArguments
        ],
        done);

    });

  }

   module.exports = test__lib__util__argumentsToArray;

} ();
