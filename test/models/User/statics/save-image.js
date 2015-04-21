! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'path',
    'fs',
    'request',
    'syn/lib/Test',
    'syn/config.json',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  module.exports = function test__models__User__statics__saveImage (done) {

    di(done, deps, function (domain, path, fs, httpGet, Test, config, User, mongoUp) {

      var mongo = mongoUp();

      var user;

      var tmp = '/tmp/test.jpg';

      var results;

      function test__models__User__statics__saveImage____downloadTestImage (done) {

        var stream = fs.createWriteStream(tmp);

        httpGet(config['example image for test upload'])
          .pipe(stream)
          .on('finish', done);

      }

      function test__models__User__statics__saveImage____imageIsDownloaded (done) {

        fs.stat(tmp, domain.intercept(function (stat) {
          stat.isFile().should.be.true;
          done();
        }))

      }

      function test__models__User__statics__saveImage____createsTestUser (done) {
        User.disposable(domain.intercept(function (testUser) {
          user = testUser;
          done();
        }));
      }

      function test__models__User__statics__saveImage____is_A_Function (done) {
        User.should.have.property('saveImage')
          .which.is.a.Function;
        done();
      }

      function test__models__User__statics__saveImage____savesImage (done) {
        User.saveImage(user._id, path.basename(tmp), domain.intercept(function (uploadResults) {
          results = uploadResults;
          done();
        }));
      }

      function test__models__User__statics__saveImage____verifyResults (done) {
        results.should.be.an.Object;
        results.should.have.property('url').which.is.a.String;
        done();
      }

      function test__models__User__statics__saveImage____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(domain.intercept(function () {
            fs.unlink(tmp, done);
          }));  
        }));
      }

      Test([

          test__models__User__statics__saveImage____downloadTestImage,
          test__models__User__statics__saveImage____imageIsDownloaded,
          test__models__User__statics__saveImage____createsTestUser,
          test__models__User__statics__saveImage____is_A_Function,
          test__models__User__statics__saveImage____savesImage,
          test__models__User__statics__saveImage____verifyResults,
          test__models__User__statics__saveImage____cleanOut

        ], done);

    });
    
  };

} ();
