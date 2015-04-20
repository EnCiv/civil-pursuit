! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function ItemPromote (done) {
    var src       =     require(require('path').join(process.cwd(), 'src'));

    var Test      =     require('syn/lib/Test');

    var Item      =     require('syn/models/Item');

    var should    =     require('should');

    Test.suite('[Model] Item.promote(itemID)', {

      'schema should be an object': function (done) {
        schema.should.be.an.Object;
        done();
      },

      'image path should exist': function (done) {
        schema.should.have.property('image').which.is.an.Object;
        done();
      }

    }, done);
  }

  module.exports = ItemPromote;

} ();
