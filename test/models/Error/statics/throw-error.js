! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Error',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  var message = 'Can not compute';

  module.exports = function Test__models__Error (done) {

    di(done, deps, function (domain, Test, ErrorModel, mongoUp) {

      var mongo = mongoUp();

      function models__Error__statics__throwError____Exists (done) {
        ErrorModel.schema.statics.should.have.property('throwError');
        done();
      }

      function models__Error__statics__throwError____Is_A_Function (done) {
        ErrorModel.schema.statics.throwError.should.be.a.Function;
        done();
      }

      function models__Error__statics__throwError____createsNewError (done) {
        ErrorModel.throwError(new Error(message), domain.intercept(function (error) {
          
          error.should.be.an.Object;

          error.should.have.property('message')
            .which.is.exactly(message);

          mongo.disconnect();

          done();

        }));
      }

      Test([

          models__Error__statics__throwError____Exists,
          models__Error__statics__throwError____Is_A_Function,
          models__Error__statics__throwError____createsNewError

        ], done);

    });
    
  };

} ();
