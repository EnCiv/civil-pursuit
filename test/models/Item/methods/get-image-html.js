! function () {
  
  'use strict';

  var di = require('syn/lib/util/di');
  var fulfill = require('syn/lib/util/di/domain');

  var deps = [
    'syn/models/Item',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'syn/lib/util/should/add'
  ];

  di(deps, function (Item, User, mongoUp, assert) {

    var mongo;

    var item;

    var popularity;

    /////////////////////////////////////////////////////////////////////////

    describe ( 'Models / Item / Methods / Get Image' , function () {

      /////////////////////////////////////////////////////////////////////////

      before ( function () {

        mongo = mongoUp();

      } ) ;

      /////////////////////////////////////////////////////////////////////////

      it ( 'should be a function' , function () {

        Item.schema.methods
          .should.have.property           ('getImageHtml')
            .which.                       is.a.Function;

      } );

      /////////////////////////////////////////////////////////////////////////

      describe ( 'Create a new test item' , function () {

        ///////////////////////////////////////////////////////////////////////

        before ( function ( done ) {

          fulfill(done, [], function (domain) {

            Item
              .disposable(domain.intercept(function (newItem) {

                item = newItem;
                // console.log(item)

                done();
            }));

          });

        } );

        ///////////////////////////////////////////////////////////////////////

        it ( 'should be an Item' , function () {

          item.should.be.an.Item;

        });

      });

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

    });

  });

} ();
