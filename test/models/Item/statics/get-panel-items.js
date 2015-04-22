! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Item',
    'syn/models/Type',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  function test__models__Item__statics__getPanelItems (done) {

    di(done, deps, function (domain, Test, Item, Type, mongoUp) {

      try {
        should.Assertion.add('Item', require('../.Item'), true);
      }
      catch ( error ) {
        // Assertion item already loaded
      }

      var mongo = mongoUp();

      var items;

      var panel = {};

      var type;

      function test__models__Item__statics__getPanelItems____is_A_Function (done) {

        Item.schema.statics.should.have.property('getPanelItems')
            .which.is.a.Function;
          done();
      }

      function test__models__Item__statics__getPanelItems____getRandomType (done) {

        Type.findOneRandom(domain.intercept(function (randomType) {
          type = randomType;

          // panel.type = type._id;
          panel.type = '55335bf22ee06eff1744dcfd';

          done();
        }));
      }

      function test__models__Item__statics__getPanelItems____getPanelItems (done) {

        Item.getPanelItems(panel, domain.intercept(function (panelItems) {
          items = panelItems;

          done();
        }))
      }

      function test__models__Item__statics__getPanelItems____itemsIsAnArray (done) {

        items.should.be.an.Array;

        done();
      }

      function test__models__Item__statics__getPanelItems____allItemsAreOfTheSameType (done) {

        items.every(function (item) {
          return item.type._id.toString() === panel.type.toString();
        }).should.be.true;

        done();
      }

      function test__models__Item__statics__getPanelItems____allItemsAreItems (done) {

        items.forEach(function (item) {
          item.should.be.an.Item;
        });

        done();
      }

      function test__models__Item__statics__getPanelItems____cleaningOut (done) {

        mongo.disconnect(done);
      }

      Test([

          test__models__Item__statics__getPanelItems____is_A_Function,
          test__models__Item__statics__getPanelItems____getRandomType,
          test__models__Item__statics__getPanelItems____getPanelItems,
          test__models__Item__statics__getPanelItems____itemsIsAnArray,
          test__models__Item__statics__getPanelItems____allItemsAreItems,
          test__models__Item__statics__getPanelItems____allItemsAreOfTheSameType,
          test__models__Item__statics__getPanelItems____cleaningOut

        ], done);

    });

  }

  module.exports = test__models__Item__statics__getPanelItems;

} ();
