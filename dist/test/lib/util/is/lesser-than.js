'use strict';

!(function () {

  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = ['syn/lib/Test', 'should'];

  function test__lib__util__is__lesserThan(done) {

    var max = Math.ceil(Math.random() * 125);
    var tryWithNumber = Math.ceil(Math.random() * 125);
    var tryWithString = '';

    for (var i = 0; i < tryWithNumber; i++) {
      tryWithString += ' ';
    }

    di(done, deps, function (domain, Test) {

      var isLesserThan, fn;

      function test__lib__util__is__lesserThan____exists(done) {
        isLesserThan = require('syn/lib/util/is/lesser-than');
        done();
      }

      function test__lib__util__is__lesserThan____isA_Function(done) {
        isLesserThan.should.be.a.Function;
        done();
      }

      function test__lib__util__is__lesserThan____returnsAFunction(done) {
        fn = isLesserThan(max);
        fn.should.be.a.Function;

        done();
      }

      function test__lib__util__is__lesserThan____tryWithNumber(done) {
        var result = fn(tryWithNumber);

        result.should.be.exactly(tryWithNumber < max);

        done();
      }

      function test__lib__util__is__lesserThan____tryWithString(done) {
        var result = fn(tryWithString);

        result.should.be.exactly(tryWithString.length < max);

        done();
      }

      Test([test__lib__util__is__lesserThan____exists, test__lib__util__is__lesserThan____isA_Function, test__lib__util__is__lesserThan____returnsAFunction, test__lib__util__is__lesserThan____tryWithNumber, test__lib__util__is__lesserThan____tryWithString], done);
    });
  }

  module.exports = test__lib__util__is__lesserThan;
})();