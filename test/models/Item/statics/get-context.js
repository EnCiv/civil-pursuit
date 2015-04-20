! function () {
  
  'use strict';

  function Item__GetContext (done) {
    var Test          =     require('syn/lib/Test');

    var Item          =     require('syn/models/Item');

    var should        =     require('should');

    var results;

    Test.suite('Item Model :: Get Context', {

      'Get Context should be a static function': function (done) {
        Item.schema.statics.should.have.property('getContext')
          .which.is.a.Function;
        done();
      },

      'Should not emit error': function (done) {
        var suite = this;

        Item.getContext({}, function (error, items) {
          if ( error ) {
            return done(error);
          }

          results = items;

          console.log(results);

          done();
        });
      },

      'Should return an array': function (done) {
        results.should.be.an.Array;
        done();
      }

    }, done);
  }

  module.exports = Item__GetContext;

} ();
