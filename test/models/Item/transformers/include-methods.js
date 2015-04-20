! function () {
  
  'use strict';

  function Item_getContext (done) {
    var Test            =     require('syn/lib/Test');

    var Item            =     require('syn/models/Item');

    var should          =     require('should');

    var _transformers   =     'syn/lib/mongoose-transformers';

    var includeMethods  =     require(_transformers + '/include-methods');

    var item;

    Test.suite('Item Model :: Get Context', {

      'Get Context should be a static function': function (done) {
        Item.schema.methods.should.have.property('getContext')
          .which.is.a.Function;
        done();
      },

      'Should not emit error': function (done) {
        var suite = this;

        Item.findOne(function (error, _item) {
          if ( error ) {
            return done(error);
          }

          item = _item;

          item = item.toObject({ transform: includeMethods, minimize: false });

          console.log(item);

          done();
        });
      },

      'Should return an object': function (done) {
        item.should.be.an.Object;
        done();
      },

      'Should be an item': function (done) {
        done();
      }

    }, done);
  }

  module.exports = Item_getContext;

} ();
