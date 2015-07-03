! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function test__lib__util__is__url (done) {

    var failsIfNotString = 123;
    var failsIfNotUrl = 'some random string';
    var ok = 'http://cloudinary.com/test.jpg';

    di(done, deps, function (domain, Test) {

      var isUrl;

      function test__lib__util__is__url____exists (done) {
        isUrl = require('syn/lib/util/is/url');
        done();
      }

      function test__lib__util__is__url____isA_Function (done) {
        isUrl.should.be.a.Function;
        done();
      }

      function test__lib__util__is__url____failsIfNotString (done) {
        isUrl(failsIfNotString).should.be.false;
        done();
      }

      function test__lib__util__is__url____failsIfNotUrl (done) {
        isUrl(failsIfNotUrl).should.be.false;
        done();
      }

      function test__lib__util__is__url____okIfUrl (done) {
        isUrl(ok).should.be.true;
        done();
      }

      Test([
          test__lib__util__is__url____exists,
          test__lib__util__is__url____isA_Function,
          test__lib__util__is__url____failsIfNotString,
          test__lib__util__is__url____failsIfNotUrl,
          test__lib__util__is__url____okIfUrl
        ],
        done);

    });

  }

   module.exports = test__lib__util__is__url;

} ();
