'use strict';

!(function () {

  'use strict';

  var should = require('should');

  var str = 'Hello this a test 1234 /ñ';

  var encrypt;

  describe('Lib / Util / Encrypt', function () {

    ///////////////////////////////////////////////////////////////////////////

    before(function () {

      encrypt = require('syn/lib/util/encrypt');
    });

    ///////////////////////////////////////////////////////////////////////////

    it('should be a function', function () {

      encrypt.should.be.a.Function;
    });

    ///////////////////////////////////////////////////////////////////////////

    it('should encrypt', function (done) {

      encrypt(str, function (error, encrypted) {

        if (error) return done(error);

        encrypted.should.be.a.String;
        encrypted.should.not.be.exactly(str);

        done();
      });
    });

    ///////////////////////////////////////////////////////////////////////////
  });
})();