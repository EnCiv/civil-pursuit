! function () {
  
  'use strict';

  var di = require('syn/lib/di');

  function Item_GetPanelItems (done) {

    di([ 'should', 'syn/lib/Test', 'syn/models/Item', 'syn/models/Type', 'syn/lib/domain' ], function (should, Test, Item, Type, runSafe) {

      var items;

      var panel = {};

      var type;

      Test.suite('Model / Item / Get Panel Items', {

        'Get Panel Items should be a static function': function (done) {
          Item.schema.statics.should.have.property('getPanelItems')
            .which.is.a.Function;
          done();
        },

        'Should fetch a random type': function (done) {
          runSafe(done, function (domain) {

            Type.findOneRandom(domain.intercept(function (randomType) {
              type = randomType;

              // panel.type = type._id;
              panel.type = '55335bf22ee06eff1744dcfd';

              done();
            }));

          });
        },

        'Should not throw': function (done) {
          runSafe(done, function (domain) {

            Item.getPanelItems(panel, domain.intercept(function (panelItems) {
              items = panelItems;

              done();
            }))

          });
        },

        'Items should be an array': function (done) {
          runSafe(done, function (domain) {

            items.should.be.an.Array;

            done();

          });
        },

        'All items type should be the same as panel type': function (done) {
          runSafe(done, function (domain) {

            items.every(function (item) {
              return item.type._id.toString() === panel.type.toString();
            }).should.be.true;

            done();

          });
        },

        'Items should be ordered by promotions descending': function (done) {
          done();
        }

      }, done);

    });

  }

  module.exports = Item_GetPanelItems;

} ();
