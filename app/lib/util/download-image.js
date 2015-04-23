! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'path',
    'fs',
    'request',
    'syn/lib/Test',
    'syn/lib/util/cloudinary',
    'syn/config.json',
    'should'
  ];

  module.exports = function test___utils__downloadImage (done) {

    di(done, deps, function (domain, fs, httpGet, config) {

      var tmp = '/tmp/test.jpg';

      var stream = fs.createWriteStream(tmp);

      httpGet(config['example image for test upload'])
        .pipe(stream)
        .on('finish', function () {
          fs.stat(tmp, domain.intercept(function (stat) {
            stat.isFile().should.be.true;
            fs.unlink(tmp, done);
          }))
        });





      var results;

      /** Download test image
      */

      function test___utils__downloadImage____downloadTestImage (done) {

      

      }

      /** Make sure image is downloaded
      */

      function test___utils__downloadImage____imageIsDownloaded (done) {

        fs.stat(tmp, domain.intercept(function (stat) {
          stat.isFile().should.be.true;
          done();
        }))

      }

      function test___utils__downloadImage____cleanOut (done) {
        fs.unlink(tmp, done);
      }

      Test([

          test___utils__downloadImage____downloadTestImage,
          test___utils__downloadImage____imageIsDownloaded,
          test___utils__downloadImage____cleanOut

        ], done);

    });
    
  };

} ();
