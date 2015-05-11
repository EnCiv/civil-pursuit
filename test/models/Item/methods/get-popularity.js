! function () {
  
  'use strict';

  var di = require('syn/lib/util/DI');
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

    describe ( 'Models / Item / Methods / Get Popularity' , function () {

      /////////////////////////////////////////////////////////////////////////

      before ( function ( done ) {

        assert ( 'Item' , require('../.Item'));

        mongo = mongoUp();

        done();

      } ) ;

      /////////////////////////////////////////////////////////////////////////

      it ( 'should be a function' , function () {

        Item.schema.methods
          .should.have.property           ('getPopularity')
            .which.                       is.a.Function;

      } );

      /////////////////////////////////////////////////////////////////////////

      describe ( 'Create a new test item' , function () {

        ///////////////////////////////////////////////////////////////////////

        before ( function ( done ) {

          this.timeout(5000);

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

      describe ( 'Get Item Popularity' , function () {

        ///////////////////////////////////////////////////////////////////////

        before ( function ( ) {

          popularity = item.getPopularity();

        });

        ///////////////////////////////////////////////////////////////////////

        it ( 'should be a Popularity' , function () {

          popularity.should.be.an.Object;
        
          popularity.should.have.property('number').which.is.a.Number;
          popularity.number.should.be.above(-1);
          popularity.number.should.be.below(101);
          
          popularity.should.have.property('ok').which.is.a.Boolean;
          popularity.ok.should.be.true;

          popularity.should.have.property('views').which.is.a.Number;
          popularity.should.have.property('promotions').which.is.a.Number;

        } );

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
