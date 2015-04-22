! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Item',
    'syn/models/Type',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  function test__models__Item__methods__getPopularity (done) {

    di(done, deps, function (domain, Test, Item, Type, User, mongoUp) {

      try {
        should.Assertion.add('Item', require('../.Item'), true);
      }
      catch ( error ) {
        // Assertion item already loaded
      }

      var mongo = mongoUp();

      var item;

      var type;

      var user;

      var parent;

      function test__models__Item__methods__getPopularity____is_A_Function (done) {

        Item.schema.methods.should.have.property('getPopularity')
            .which.is.a.Function;
          done();
      }

      function test__models__Item__methods__getPopularity____getRandomType (done) {

        Type.findOneRandom(domain.intercept(function (randomType) {
          type = randomType;

          if ( ! type.parent ) {
            return done();
          }

          test__models__Item__methods__getPopularity____getRandomParent(done);
          
        }))
      }

      function test__models__Item__methods__getPopularity____getRandomParent (done) {

        Item
          .findOne({ type: type.parent })
          .exec(domain.intercept(function (parentItem) {
            parent = parentItem;
            done();
          }));
      }

      function test__models__Item__methods__getPopularity____createTestUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();  
        }))
      }

      function test__models__Item__methods__getPopularity____createTestItem (done) {

        var _item = {
          type          :   type._id,
          subject       :   'Test subject',
          description   :   'Test description',
          user          :   user._id
        };

        if ( parent ) {
          _item.parent  =   parent._id;
        }

        Item
          .create(_item)
          .then(function (newItem) {

            item = newItem;

            done();

          }, done);
      }

      function test__models__Item__methods__getPopularity____isAnItem (done) {

        item.should.be.an.Item;
        done();

      }

      function test__models__Item__methods__getPopularity____getPopularity (done) {

        var popularity = item.getPopularity();

        popularity.should.be.an.Object;
        
        popularity.should.have.property('number').which.is.a.Number;
        popularity.number.should.be.above(-1);
        popularity.number.should.be.below(101);
        
        popularity.should.have.property('ok').which.is.a.Boolean;
        popularity.ok.should.be.true;

        popularity.should.have.property('views').which.is.a.Number;
        popularity.should.have.property('promotions').which.is.a.Number;

        done()
        
      }

      function test__models__Item__methods__getPopularity____cleaningOut (done) {

        mongo.disconnect(done);
      }

      Test([

          test__models__Item__methods__getPopularity____is_A_Function,
          test__models__Item__methods__getPopularity____getRandomType,
          test__models__Item__methods__getPopularity____createTestUser,
          test__models__Item__methods__getPopularity____createTestItem,
          test__models__Item__methods__getPopularity____isAnItem,
          test__models__Item__methods__getPopularity____getPopularity,
          test__models__Item__methods__getPopularity____cleaningOut

        ], done);

    });

  }

  module.exports = test__models__Item__methods__getPopularity;

} ();
