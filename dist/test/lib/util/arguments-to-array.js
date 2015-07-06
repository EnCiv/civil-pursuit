'use strict';

!(function () {

  'use strict';

  var should = require('should');

  describe('Lib / Util / Arguments To Array', function () {

    var argumentsToArray;

    before(function () {

      argumentsToArray = require('syn/lib/util/arguments-to-array');
    });

    it('should be a function', function () {

      argumentsToArray.should.be.a.Function;
    });

    it('should return an array of arguments', function (done) {
      function foo() {
        var array = argumentsToArray(arguments);

        array.should.be.an.Array;

        array[0].should.be.exactly(1);

        array[1].should.be.exactly('abc');

        done();
      }

      foo(1, 'abc');
    });
  });
})();