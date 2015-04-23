! function () {
  
  'use strict';

  var Item      =   require('syn/models/Item');
  var User      =   require('syn/models/User');
  var mongoUp   =   require('syn/lib/util/connect-to-mongoose');
  var isA       =   require('syn/lib/util/should/add');

  var mongo;
  var item;

  describe ( 'Models / Item / Statics / Disposable' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      isA ( 'Item' , require('../.Item'));

      mongo = mongoUp();

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a static method' , function () {

      Item.schema.statics.should.have.property('disposable')
        .which.is.a.Function;

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should create item' , function (done) {

      Item.disposable(function (error, disposableItem) {

        if ( error ) return done(error);

        item = disposableItem;

        item.should.be.an.Item;

        done();
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    after ( function (done) {

      User.remove(item.user, function () {
        item.remove(function () {
          mongo.disconnect(done);
        });
      });

    } );

  } ); 

} ();
