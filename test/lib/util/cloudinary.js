! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'cloudinary',
    'syn/lib/Test',
    'should'
  ];

  module.exports = function test__lib__util__cloudinary (done) {


    di(done, deps, function (domain, cloudinary, Test) {

      var fn, cloudi;

      function test__lib__util__cloudinary____exists (done) {

        cloudi = require('syn/lib/util/cloudinary');

        done();

      }

      function test__lib__util__cloudinary____returnsObject (done) {

        cloudi.should.be.an.Object;

        done();

      }

      function test__lib__util__cloudinary____hasAnUploader (done) {

        cloudi.should.have.property('uploader')
          .which.is.an.Object;

        done();

      }

      Test([

          test__lib__util__cloudinary____exists,
          test__lib__util__cloudinary____returnsObject,
          test__lib__util__cloudinary____hasAnUploader

        ], done);

    });
    
  };

} ();
