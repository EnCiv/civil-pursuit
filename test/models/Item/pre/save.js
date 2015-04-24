! function () {
  
  'use strict';

  require('should');

  var Item = require('syn/models/Item');

  var assert = require('syn/lib/util/should/add');

  var mongoUp = require('syn/lib/util/connect-to-mongoose');

  var User = require('syn/models/User');

  var preSave;

  var mongo;

  var item;

  describe ( 'Models / Item / Pre / Save' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      preSave = require('syn/models/Item/pre/save');

      assert ( 'Item' , require('../.Item'));

      mongo = mongoUp();

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a function' , function () {

      preSave.should.be.a.Function;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'Create test item' , function (done) {

      Item.disposable().then(function (_item) {
        item = _item;
        item.should.be.an.Item;
        done();
      }, done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      User.remove(item.user, function () {
        item.remove(function () {
          mongo.disconnect(done);
        });
      });

    } );

    ///////////////////////////////////////////////////////////////////////////

  } );

} ();
