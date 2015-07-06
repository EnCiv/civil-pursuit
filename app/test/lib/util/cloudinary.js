! function () {
  
  'use strict';

  var should = require('should');

  describe ( 'Lib / Util / Cloudinary', function () {

    var cloudinary;

    before ( function () {

      cloudinary = require('../../../lib/app/cloudinary');

    } );

    it ( 'should be an object' , function () {

      cloudinary.should.be.an.Object;

    });

    it ( 'should have an uploader' , function () {

      cloudinary.should.have.property('uploader')
        .which.is.an.Object;

    });

  } );

} ();
