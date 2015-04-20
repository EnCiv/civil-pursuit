! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

  module.exports = function Test__Models__Country (done) {

    di(done, deps, function (domain, Test) {

      var Country;

      function Models__Country____Exists (done) {
        Country = require('syn/models/Country');
        done();
      }

      function Models__Country____Is_A_Function (done) {
        Country.should.be.a.Function;
        done();
      }

      function Models__Country____Is_A_Model (done) {
        Country.prototype.constructor.name.should.eql('model');
        done();
      }

      function Models__Country____ExtendsEventEmitter (done) {
        Country.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      }

      function Models__Country____HasSchema (done) {
        Country.schema.should.be.an.Object;
        done();
      }

      Test([

          Models__Country____Exists,
          Models__Country____Is_A_Function,
          Models__Country____Is_A_Model,
          Models__Country____ExtendsEventEmitter,
          Models__Country____HasSchema

        ], done);

    });
    
  };

} ();
