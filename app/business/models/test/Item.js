! function () {
  
  'use strict';

  var should = require('should');

  describe('Item Model', function () {

    var Item;

    before(function () {
      Item = require('../Item');
    });

    it ( 'should be a function', function () {
      Item.should.be.a.Function;
    });

    it ( 'its prototype should be an instanceof model', function () {
      Item.prototype.constructor.name.should.eql('model');
    });

    it ( 'which extends EventEmitter', function () {
      Item.prototype.should.be.an.instanceof(require('events').EventEmitter);
    });

    it ( 'should have a schema property', function () {
      Item.schema.should.be.an.Object;
    });

    describe ( 'Item Model Static Methods', function () {

      it ('should have static methods', function () {
        Item.schema.statics.should.be.an.Object;
      });

      it ( 'should have a static method called updateById', function () {
        Item.schema.statics.should.have.property('updateById').which.is.a.Function;
      });

      it ( 'should have a static method called evaluate', function () {
        Item.schema.statics.should.have.property('evaluate').which.is.a.Function;
      });

      it ( 'should have a static method called details', function () {
        Item.schema.statics.should.have.property('details').which.is.a.Function;
      });

      it ( 'should have a static method called incrementView', function () {
        Item.schema.statics.should.have.property('incrementView').which.is.a.Function;
      });

      it ( 'should have a static method called incrementPromotion', function () {
        Item.schema.statics.should.have.property('incrementPromotion').which.is.a.Function;
      });

    });

    describe ( 'Query Item', function () {

      describe ( 'Item.create', function () {

        var new_item = {
          'subject': 'Test subject',
          'description': 'Hello',
          'type': 'Topic'
        };

        it ( 'should create a new item', function () {

        });

      });

    });

  });

} ();
