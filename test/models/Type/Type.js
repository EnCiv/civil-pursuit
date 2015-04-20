! function () {
  
  'use strict';

  var should = require('should');

  var Test = require('syn/lib/Test');

  var Type;

  module.exports = function TestModule_Models__Type (done) {

    function Module_Models__Type_Exists (done) {
      Type = require('syn/models/Type');
      done();
    }

    function Module_Models__Type_Is_A_Function (done) {
      Type.should.be.a.Function;
      done();
    }

    function Module_Models__Type_IsAnInstanceOfModel (done) {
      Type.prototype.constructor.name.should.eql('model');
      done();
    }

    function Module_Models__Type_ExtendsEventEmitter (done) {
      Type.prototype.should.be.an.instanceof(require('events').EventEmitter);
      done();
    }

    function Module_Models__Type_Has_A_Schema (done) {
      Type.schema.should.be.an.Object;
      done();
    }

    Test([

        Module_Models__Type_Exists,
        Module_Models__Type_Is_A_Function,
        Module_Models__Type_IsAnInstanceOfModel,
        Module_Models__Type_ExtendsEventEmitter,
        Module_Models__Type_Has_A_Schema

      ], done);
    
  };

} ();
