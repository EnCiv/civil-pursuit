! function () {
  
  'use strict';

  var should = require('should');

  module.exports = function testModelUser (done) {
    var src = require(require('path').join(process.cwd(), 'src'));

    var Test = src('lib/Test');

    var Item = src('models/Item');

    Test.suite('Model Item Class', {

      'should be a function': function (done) {
        Item.should.be.a.Function;
        done();
      },

      'should be an instanceof model': function (done) {
        Item.prototype.constructor.name.should.eql('model');
        done();
      },

      'should extend EventEmitter': function (done) {
        Item.prototype.should.be.an.instanceof(require('events').EventEmitter);
        done();
      },

      'should have a schema property': function (done) {
        Item.schema.should.be.an.Object;
        done();
      },

      'should have static methods': function (done) {
        Item.schema.statics.should.be.an.Object;
        done();
      }

    }, done);
    
  };

} ();
