! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Item',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  function test__models__Item__methods__getPopularity (done) {

    di(done, deps, function (domain, Test, Item, mongoUp) {

      try {
        should.Assertion.add('Item', require('../.Item'), true);
      }
      catch ( error ) {
        // Assertion item already loaded
      }

      var mongo = mongoUp();

      var item;

      function test__models__Item__methods__getPopularity____is_A_Function (done) {

        Item.schema.methods.should.have.property('getPopularity')
            .which.is.a.Function;
          done();
      }

      function test__models__Item__methods__getPopularity____getRandomItem (done) {

        Item.findOneRandom(domain.intercept(function (randomItem) {
          item = randomItem;
          done(); 
        }))
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
          test__models__Item__methods__getPopularity____getRandomItem,
          test__models__Item__methods__getPopularity____isAnItem,
          test__models__Item__methods__getPopularity____getPopularity,
          test__models__Item__methods__getPopularity____cleaningOut

        ], done);

    });

  }

  module.exports = test__models__Item__methods__getPopularity;

} ();
