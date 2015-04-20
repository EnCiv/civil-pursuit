! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

  module.exports = function Test__Models__Error (done) {

    di(done, deps, function (domain, Test) {

      var Error;

      function Models__Error____Exists (done) {
        Error = require('syn/models/Error');
        done();
      }

      function Models__Error____Is_A_Function (done) {
        Error.should.be.a.Function;
        done();
      }

      function Models__Error____Is_A_Model (done) {
        Error.prototype.constructor.name.should.eql('model');
        done();
      }

      function Models__Error____ExtendsEventEmitter (done) {
        Error.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      }

      function Models__Error____HasSchema (done) {
        Error.schema.should.be.an.Object;
        done();
      }

      function Models__Error____HasStaticMethods (done) {
        Error.schema.statics.should.be.an.Object;
        done();
      }

      Test([

          Models__Error____Exists,
          Models__Error____Is_A_Function,
          Models__Error____Is_A_Model,
          Models__Error____ExtendsEventEmitter,
          Models__Error____HasSchema,
          Models__Error____HasStaticMethods

        ], done);

    });
    
  };

} ();
