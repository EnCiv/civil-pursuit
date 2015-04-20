! function () {
  
  'use strict';

  var should = require('should');

  var Test = require('syn/lib/Test');

  var Item;

  module.exports = function TestModule_Models__Item (done) {

    function Module_Models__Item_Exists (done) {
      Item = require('syn/models/Item');
      done();
    }

    function Module_Models__Item_Is_A_Function (done) {
      Item.should.be.a.Function;
      done();
    }

    function Module_Models__Item_IsAnInstanceOfModel (done) {
      Item.prototype.constructor.name.should.eql('model');
      done();
    }

    function Module_Models__Item_ExtendsEventEmitter (done) {
      Item.prototype.should.be.an.instanceof(require('events').EventEmitter);
      done();
    }

    function Module_Models__Item_Has_A_Schema (done) {
      Item.schema.should.be.an.Object;
      done();
    }

    function Module_Models__Item_HasStaticMethods (done) {
      Item.schema.statics.should.be.an.Object;
      Object.keys(Item.schema.statics).length.should.be.above(0);
      done();
    }

    function Module_Models__Item_HasMethods (done) {
      Item.schema.methods.should.be.an.Object;
      Object.keys(Item.schema.methods).length.should.be.above(0);
      done();
    }

    Test([

        Module_Models__Item_Exists,
        Module_Models__Item_Is_A_Function,
        Module_Models__Item_IsAnInstanceOfModel,
        Module_Models__Item_ExtendsEventEmitter,
        Module_Models__Item_Has_A_Schema,
        Module_Models__Item_HasMethods,
        Module_Models__Item_HasStaticMethods

      ], done);
    
  };

} ();
