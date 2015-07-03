! function () {
  
  'use strict';

  require('should');

  var failsIfNotString = 123;
  var failsIfNotCloudinaryUrl = 'some random string';
  var ok = 'http://cloudinary.com/test.jpg';
  var isCloudinaryUrl;

  describe ( 'Lib / Util / Is / Cloudinary URL' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      isCloudinaryUrl = require('syn/lib/util/is/cloudinary-url');

    } );


    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a function' , function () {

      isCloudinaryUrl.should.be.a.Function;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should fail if missing string' , function () {

      isCloudinaryUrl(failsIfNotString).should.be.false;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should fail if string not a cloudinary url' , function () {

      isCloudinaryUrl(failsIfNotCloudinaryUrl).should.be.false;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should work if string is a cloudinary url' , function () {

      isCloudinaryUrl(ok).should.be.true;

    } );

    ///////////////////////////////////////////////////////////////////////////

  } );

} ();
