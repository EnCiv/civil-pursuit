! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

  module.exports = function Test__Models__Config (done) {

    di(done, deps, function (domain, Test) {

      var Config;

      function Models__Config____Exists (done) {
        Config = require('syn/models/Config');
        done();
      }

      function Models__Config____Is_A_Function (done) {
        Config.should.be.a.Function;
        done();
      }

      function Models__Config____Is_A_Model (done) {
        Config.prototype.constructor.name.should.eql('model');
        done();
      }

      function Models__Config____ExtendsEventEmitter (done) {
        Config.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      }

      function Models__Config____HasSchema (done) {
        Config.schema.should.be.an.Object;
        done();
      }

      Test([

          Models__Config____Exists,
          Models__Config____Is_A_Function,
          Models__Config____Is_A_Model,
          Models__Config____ExtendsEventEmitter,
          Models__Config____HasSchema

        ], done);

    });
    
  };

} ();
