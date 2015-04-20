! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

  module.exports = function Test__Models__Criteria (done) {

    di(done, deps, function (domain, Test) {

      var Criteria;

      function Models__Criteria____Exists (done) {
        Criteria = require('syn/models/Criteria');
        done();
      }

      function Models__Criteria____Is_A_Function (done) {
        Criteria.should.be.a.Function;
        done();
      }

      function Models__Criteria____Is_A_Model (done) {
        Criteria.prototype.constructor.name.should.eql('model');
        done();
      }

      function Models__Criteria____ExtendsEventEmitter (done) {
        Criteria.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      }

      function Models__Criteria____HasSchema (done) {
        Criteria.schema.should.be.an.Object;
        done();
      }

      Test([

          Models__Criteria____Exists,
          Models__Criteria____Is_A_Function,
          Models__Criteria____Is_A_Model,
          Models__Criteria____ExtendsEventEmitter,
          Models__Criteria____HasSchema

        ], done);

    });
    
  };

} ();
