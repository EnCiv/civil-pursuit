! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function test__lib__util__is__cloudinaryUrl (done) {

    var failsIfNotString = 123;
    var failsIfNotCloudinaryUrl = 'some random string';
    var ok = 'http://cloudinary.com/test.jpg';

    di(done, deps, function (domain, Test) {

      var isCloudinaryUrl;

      function test__lib__util__is__cloudinaryUrl____exists (done) {
        isCloudinaryUrl = require('syn/lib/util/is/cloudinary-url');
        done();
      }

      function test__lib__util__is__cloudinaryUrl____isA_Function (done) {
        isCloudinaryUrl.should.be.a.Function;
        done();
      }

      function test__lib__util__is__cloudinaryUrl____failsIfNotString (done) {
        isCloudinaryUrl(failsIfNotString).should.be.false;
        done();
      }

      function test__lib__util__is__cloudinaryUrl____failsIfNotCloudinaryUrl (done) {
        isCloudinaryUrl(failsIfNotCloudinaryUrl).should.be.false;
        done();
      }

      function test__lib__util__is__cloudinaryUrl____okIfCloudinaryUrl (done) {
        isCloudinaryUrl(ok).should.be.true;
        done();
      }

      Test([
          test__lib__util__is__cloudinaryUrl____exists,
          test__lib__util__is__cloudinaryUrl____isA_Function,
          test__lib__util__is__cloudinaryUrl____failsIfNotString,
          test__lib__util__is__cloudinaryUrl____failsIfNotCloudinaryUrl,
          test__lib__util__is__cloudinaryUrl____okIfCloudinaryUrl
        ],
        done);

    });

  }

   module.exports = test__lib__util__is__cloudinaryUrl;

} ();
