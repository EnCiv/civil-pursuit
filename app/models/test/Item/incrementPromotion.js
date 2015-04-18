! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function ItemSchema (done) {
    var src       =     require(require('path').join(process.cwd(), 'src'));

    var Test      =     src('lib/Test');

    var Item      =     src('models/Item');

    var should    =     require('should');

    try {
      should.Assertion.add('item', src('models/test/Item/assert'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Item.incrementPromotion()', {

      'incrementPromotion should be a function': function (done) {
        Item.incrementPromotion.should.be.a.Function;
        done();
      },

      'it should increment an item promotions counter': function (done) {
        Item
          .findOneRandom(function (error, item) {
            if ( error ) {
              return done(error);
            }

            item.should.be.an.item;

            Item.incrementPromotion(item._id, function (error, item2) {
              if ( error ) {
                return done(error);
              }

              item2.should.be.an.item;

              item2.promotions.should.be.exactly(item.promotions + 1);

              done();
            });
          })
      }

    }, done);
  }

  module.exports = ItemSchema;

} ();
