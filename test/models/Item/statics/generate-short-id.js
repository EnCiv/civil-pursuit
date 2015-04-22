! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Item',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  function test__models__Item__statics__generateShortId (done) {

    di(done, deps, function (domain, Test, Item, mongoUp) {

      try {
        should.Assertion.add('Item', require('../.Item'), true);
      }
      catch ( error ) {
        // Assertion item already loaded
      }

      var mongo = mongoUp();

      var id;

      function test__models__Item__statics__generateShortId____is_A_Function (done) {

        Item.schema.statics.should.have.property('generateShortId')
            .which.is.a.Function;
          done();
      }

      function test__models__Item__statics__generateShortId____generatesShortId (done) {

        Item.generateShortId(domain.intercept(function (shortId) {
          id = shortId;

          done();
        }));
      }

      function test__models__Item__statics__generateShortId____shortIdIs_A_String (done) {

        id.should.be.a.String;

        done();
      }

      function test__models__Item__statics__generateShortId____shortIdDoesNotExistsInDB (done) {

        Item.find({ id: id })
          .exec(domain.intercept(function (items) {

            items.length.should.be.exactly(0);

            done();
          }));

      }

      function test__models__Item__statics__generateShortId____cleaningOut (done) {

        mongo.disconnect(done);
      }

      Test([

          test__models__Item__statics__generateShortId____is_A_Function,
          test__models__Item__statics__generateShortId____generatesShortId,
          test__models__Item__statics__generateShortId____shortIdIs_A_String,
          test__models__Item__statics__generateShortId____shortIdDoesNotExistsInDB,
          test__models__Item__statics__generateShortId____cleaningOut

        ], done);

    });

  }

  module.exports = test__models__Item__statics__generateShortId;

} ();
