! function () {
  
  'use strict';

  var async     =   require('async');
  var Item      =   require('syn/models/Item');
  var User      =   require('syn/models/User');
  var mongoUp   =   require('syn/lib/util/connect-to-mongoose');
  var isA       =   require('syn/lib/util/should/add');

  var mongo;
  var item;
  var evaluation;

  describe ( 'Models / Item / Statics / Evaluate' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function (done) {

      isA ( 'Evaluation' , require('../.Evaluation'));

      mongo = mongoUp();

      Item.findOneRandom(function (error, _item) {
        item = _item;
        done();
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a static method' , function () {

      Item.schema.statics.should.have.property('evaluate')
        .which.is.a.Function;

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should not throw error' , function (done) {
      // increasing timeout in case creating item is creating also parent items
      this.timeout(15000);

      Item
        
        .evaluate(item.user, item._id, function (error, _evaluation) {

          if ( error ) {
            return done(error);
          }
console.log(_evaluation)
          evaluation = _evaluation;

          done();
        });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be an evaluation' , function (done) {

      this.timeout(999)

      evaluation.should.be.an.Evaluation;

      done();

    });

    ///////////////////////////////////////////////////////////////////////////

    after ( function (done) {

      this.timeout(5000);

      var d = require('domain').create().on('error', done);

      item.remove(function () {
        mongo.disconnect(done);
      });

    } );

  } ); 

} ();
