! function () {
  
  'use strict';

  var should = require('should');

  module.exports = function testModelUser (done) {
    var Test = require('syn/lib/Test');

    var User = require('syn/models/User');

    Test.suite('Model User Class', {

      'should be a function': function (done) {
        User.should.be.a.Function;
        done();
      },

      'should be an instanceof model': function (done) {
        User.prototype.constructor.name.should.eql('model');
        done();
      },

      'should extend EventEmitter': function (done) {
        User.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      },

      'should have a schema property': function (done) {
        User.schema.should.be.an.Object;
        done();
      },

      'should have static methods': function (done) {
        User.schema.statics.should.be.an.Object;
        done();
      }

    }, done);
    
  };

} ();
