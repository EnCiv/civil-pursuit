! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

  module.exports = function Test__Models__Feedback (done) {

    di(done, deps, function (domain, Test) {

      var Feedback;

      function Models__Feedback____Exists (done) {
        Feedback = require('syn/models/Feedback');
        done();
      }

      function Models__Feedback____Is_A_Function (done) {
        Feedback.should.be.a.Function;
        done();
      }

      function Models__Feedback____Is_A_Model (done) {
        Feedback.prototype.constructor.name.should.eql('model');
        done();
      }

      function Models__Feedback____ExtendsEventEmitter (done) {
        Feedback.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      }

      function Models__Feedback____HasSchema (done) {
        Feedback.schema.should.be.an.Object;
        done();
      }

      Test([

          Models__Feedback____Exists,
          Models__Feedback____Is_A_Function,
          Models__Feedback____Is_A_Model,
          Models__Feedback____ExtendsEventEmitter,
          Models__Feedback____HasSchema

        ], done);

    });
    
  };

} ();
