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

    var schema    =     src('models/Item/schema');

    Test.suite('Item Model Schema', {

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

  module.exports = ItemSchema;

} ();
