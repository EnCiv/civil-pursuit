! function () {
  
  'use strict';

  var Item      =   require('syn/models/Item');
  var mongoUp   =   require('syn/lib/util/connect-to-mongoose');
  var isA       =   require('syn/lib/util/should/add');
  var fulfill   =   require('syn/lib/util/di/domain');

  var id;
  var mongo;

  /////////////////////////////////////////////////////////////////////////////

  describe ( 'Models / Item / Statics / Generate Short Id', function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      mongo = mongoUp();

      isA ( 'Item' , require('../.Item'));

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a static method' , function () {

      Item.schema.statics.should.have.property('generateShortId')
        .which.is.a.Function;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should generate a short id' , function (done) {

      Item.generateShortId(function (error, shortId) {
        if ( error ) return done(error);

        id = shortId;

        done();
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    describe ( 'Generated Short Id' , function () {

      /////////////////////////////////////////////////////////////////////////

      it ( 'should be a string' , function () {

        id.should.be.a.String;

      });

      /////////////////////////////////////////////////////////////////////////

      it ( 'should not exist in DB' , function (done) {

        Item.find({ id: id })
          
          .exec()
          
          .then(function (items) {
            items.length.should.be.exactly(0);

            done();
          });

      });

      /////////////////////////////////////////////////////////////////////////

    });

    ///////////////////////////////////////////////////////////////////////////

    after ( function () {

      mongo.disconnect();

    } );

    ///////////////////////////////////////////////////////////////////////////

  } );

} ();
