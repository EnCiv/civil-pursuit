! function () {
  
  'use strict';

  var Item      =   require('syn/models/Item');
  var Type      =   require('syn/models/Type');
  var mongoUp   =   require('syn/lib/util/connect-to-mongoose');
  var isA       =   require('syn/lib/util/should/add');
  var fulfill   =   require('syn/lib/util/di/domain');

  var mongo;
  var type;
  var items;
  var panel = {};

  describe ( 'Models / Item / Statics / Get Panel Items' , function (done) {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      isA ( 'PanelItem' , require('../.Panel-Item'));

      mongo = mongoUp();

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a static method' , function () {

      Item.schema.statics.should.have.property('getPanelItems')
        .which.is.a.Function;

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should get random type' , function (done) {

      Type.findOneRandom(function (error, randomType) {

        if ( error ) return done(error);

        type = randomType;

        panel.type = type._id;

        done();
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should get panel items' , function (done) {

      Item.getPanelItems(panel, function (error, panelItems) {
        if ( error ) return done(error);

        items = panelItems;

        done();
      });

    } );

    ///////////////////////////////////////////////////////////////////////////

    describe ( 'Panel items' , function () {

      it ( 'should be an array of items' , function () {
        console.log('items', items)

        items.should.be.an.Array;

        items.forEach(function (item) {
          item.should.be.a.PanelItem;
        });

      } );

      /////////////////////////////////////////////////////////////////////////

      it ( 'should all have the same type as panel' , function () {

        items.every(function (item) {
          return item.type._id.toString() === panel.type.toString();
        }).should.be.true;

      } );

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function () {

      mongo.disconnect();

    } );

  } ); 

} ();
