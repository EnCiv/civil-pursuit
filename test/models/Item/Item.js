! function () {
  
  'use strict';

  var should = require('should');

  var Item;

  describe ( 'Models / Item' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      Item = require('syn/models/Item');

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a function' , function () {

      Item.should.be.a.Function;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be an instance of model' , function () {

      Item.prototype.constructor.name.should.eql('model');

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should extend event emitter' , function () {

      Item.prototype.should.be.an.instanceof(require('events').EventEmitter);

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a schema' , function () {

      Item.schema.should.be.an.Object;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have static methods' , function () {

      Item.schema.statics.should.be.an.Object;
      Object.keys(Item.schema.statics).length.should.be.above(0);

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have methods' , function () {

      Item.schema.methods.should.be.an.Object;
      Object.keys(Item.schema.methods).length.should.be.above(0);

    } );

    ///////////////////////////////////////////////////////////////////////////

  }) ;

} ();
