! function () {
  
  'use strict';

  var async     =   require('async');
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
      // increasing timeout in case creating item is creating also parent items
      this.timeout(15000);

      Item
        
        .disposable().then(function (disposableItem) {

          item = disposableItem;

          item.should.be.an.Item;

          done();
        });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'item should exist' , function (done) {

      this.timeout(999)

      Item
        
        .findById(item._id)

        .exec()

        .then(function (_item) {

          _item._id.toString().should.be.exactly(item._id.toString());

          item = _item;

          done();

        }, done);

    });

    ///////////////////////////////////////////////////////////////////////////

    after ( function (done) {

      this.timeout(5000);

      var d = require('domain').create().on('error', done);

      // we need to remove also eventual parents

      item.getLineage(d.intercept(function (parents) {
        async.each(parents, function (parent, done) {
          parent.remove(done);
        }, d.intercept(function () {
          User.remove(item.user, function () {
            item.remove(function () {
              mongo.disconnect(done);
            });
          });
        }));
      }));

    } );

  } ); 

} ();
