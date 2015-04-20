! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

  module.exports = function Test__Models__Vote (done) {

    di(done, deps, function (domain, Test) {

      var Vote;

      function Models__Vote____Exists (done) {
        Vote = require('syn/models/Vote');
        done();
      }

      function Models__Vote____Is_A_Function (done) {
        Vote.should.be.a.Function;
        done();
      }

      function Models__Vote____Is_A_Model (done) {
        Vote.prototype.constructor.name.should.eql('model');
        done();
      }

      function Models__Vote____ExtendsEventEmitter (done) {
        Vote.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      }

      function Models__Vote____HasSchema (done) {
        Vote.schema.should.be.an.Object;
        done();
      }

      function Models__Vote____HasStaticMethods (done) {
        Vote.schema.statics.should.be.an.Object;
        done();
      }

      Test([

          Models__Vote____Exists,
          Models__Vote____Is_A_Function,
          Models__Vote____Is_A_Model,
          Models__Vote____ExtendsEventEmitter,
          Models__Vote____HasSchema,
          Models__Vote____HasStaticMethods

        ], done);

    });
    
  };

} ();
