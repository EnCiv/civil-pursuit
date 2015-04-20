! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'should'
  ];

  module.exports = function test__models__User (done) {

    di(done, deps, function (domain, Test, User) {

      function test__models__User____is_A_Function (done) {
        User.should.be.a.Function;
        done();
      }

      function test__models__User____is_A_Model (done) {
        User.prototype.constructor.name.should.eql('model');
        done();
      }

      function test__models__User____extendsEventEmitter (done) {
        User.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      }

      function test__models__User____hasSchema (done) {
        User.schema.should.be.an.Object;
        done();
      }

      function test__models__User____hasStaticMethods (done) {
        User.schema.statics.should.be.an.Object;
        done();
      }

      Test([

          test__models__User____is_A_Function,
          test__models__User____is_A_Model,
          test__models__User____extendsEventEmitter,
          test__models__User____hasSchema,
          test__models__User____hasStaticMethods

        ], done);

    });
    
  };

} ();
