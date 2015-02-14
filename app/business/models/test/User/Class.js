! function () {
  
  'use strict';

  module.exports = function testModelUser (done) {
    var src = require(require('path').join(process.cwd(), 'src'));

    var Test = src('lib/Test');

    var User = src('models/User');

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

    return

    describe ( 'User Class' , function () {

      // Require User Class

      before(function () {
        User = require('../../User');
      });

      // User Class should be a Function

      it ( 'should be a function', function () {
        User.should.be.a.Function;
      });

      // User Class should be an instance of model

      it ( 'its prototype should be an instanceof model', function () {
        User.prototype.constructor.name.should.eql('model');
      });

      // User Class should extend EventEmitter

      it ( 'which extends EventEmitter', function () {
        User.prototype.should.be.an.instanceof(require('events').EventEmitter);
      });

      // User Class should have a schema property

      it ( 'should have a schema property', function () {
        User.schema.should.be.an.Object;
      });
    });

    describe ( 'User Model Static Methods', function () {

      var User = require('../../User');

      it ('should have static methods', function () {
        User.schema.statics.should.be.an.Object;
      });

    });
  };

} ();
