! function () {
  
  'use strict';

  var di = require('syn/lib/util/di');
  var fulfill = require('syn/lib/util/di/domain');

  var deps = [
    'syn/models/Item',
    'syn/models/Type',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'syn/lib/util/should/add'
  ];

  di( deps, function (

      /* Object */      Item,
      /* Object */      Type,
      /* Object */      User,
      /* Function */    mongoUp,
      /* Function */    assert
    
    ) {

    describe ( ' Models / Item / Methods / To Panel Item ' , function () {

      var mongo;

      var item;

      var panelItem;

      /////////////////////////////////////////////////////////////////////////

      assert('PanelItem', require('../.Panel-Item'));

      /////////////////////////////////////////////////////////////////////////

      before ( function ( done ) {

        mongo = mongoUp();

        done();

      } ) ;

      /////////////////////////////////////////////////////////////////////////

      it ( 'is a function' , function () {

        Item.schema.methods.should.have.  property('toPanelItem')
          .which.                         is.a.Function;

      } );

      /////////////////////////////////////////////////////////////////////////

      describe( 'Create test item' , function ( ) {

        ///////////////////////////////////////////////////////////////////////

        before ( function ( done ) {

          fulfill( done, [], function ( domain ) {

            Item
              .disposable(domain.intercept(function (newItem) {

                item = newItem;

                done();

              }));

          } );


        } );


        ///////////////////////////////////////////////////////////////////////

        it ( 'should be an Item' , function () {

          item.should.be.an.Item;

        } );

        ///////////////////////////////////////////////////////////////////////

      } );

      /////////////////////////////////////////////////////////////////////////

      describe ( 'Apply to-panel-item method to test item', function () {

        ///////////////////////////////////////////////////////////////////////

        before ( function ( done ) {

          fulfill( done, [], function ( domain ) {

            item.toPanelItem(domain.intercept(function (panelized) {
              panelItem = panelized;

              done();
            }));

          } );


        } );

        ///////////////////////////////////////////////////////////////////////

        it ( 'should be a Panel Item' , function () {

          this.timeout(5000);

          panelItem.should.be.a.PanelItem;

        } );

        it ( 'should have a subtype matching its type' , function () {

          

        } );

        ///////////////////////////////////////////////////////////////////////

      } );

      /////////////////////////////////////////////////////////////////////////

      after ( function ( done ) {

        fulfill ( done , [], function ( domain ) {

          User.remove({ _id: item.user }, domain.intercept(function () {
            item.remove(domain.intercept(function () {
              mongo.disconnect(done);
            }));
          }));

        } );

      } );

      /////////////////////////////////////////////////////////////////////////

    } );

  } );

} ();
