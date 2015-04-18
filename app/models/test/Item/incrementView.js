! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function ItemSchema (done) {
    var src       =     require(require('path').join(process.cwd(), 'src'));

    var Test      =     require('syn/lib/Test');

    var Item      =     require('syn/models/Item');

    var should    =     require('should');

    try {
      should.Assertion.add('item', require('syn/models/test/Item/assert'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Item.incrementView()', {

      'incrementView should be a function': function (done) {
        Item.incrementView.should.be.a.Function;
        done();
      },

      'it should increment an item view': function (done) {
        Item
          .findOneRandom(function (error, item) {
            if ( error ) {
              return done(error);
            }

            item.should.be.an.item;

            Item.incrementView(item._id, function (error, item2) {
              if ( error ) {
                return done(error);
              }

              item2.should.be.an.item;

              item2.views.should.be.exactly(item.views + 1);

              done();
            });
          })
      }

    }, done);
  }

  module.exports = ItemSchema;

} ();
