! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  require('syn/lib/util/should/describe');

  function assertType () {

    var self = this;

    ///////////////////////////////////////////////////////////////////////////

    assert('ObjectID', require('../.ObjectID'));
    
    this.params = { operator: 'to be a Type' };

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Object;

    ///////////////////////////////////////////////////////////////////////////

    should.$describe('Type has an ObjectID', this.obj, function (it) {
      it
        .should.have.property           ('_id')
          .which.                       is.an.ObjectID;
    });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe('Type has a name', this.obj, function (it) {
      it
        .should.have.property           ('name')
          .which.                       is.a.String;
    });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe('Type has harmony', this.obj, function (it) {
      it
        .should.have.property           ('harmony')
          .which.                       is.an.Array;
    } );

    ///////////////////////////////////////////////////////////////////////////

    if ( this.obj.parent ) {
      should.$describe('Type has a parent', this.obj, function (it) {
        it
          .should.have.property         ('parent')
            .which.                     is.an.ObjectID;
          });
    }

    ///////////////////////////////////////////////////////////////////////////

    if ( this.obj.harmony.length ) {

      should.$describe('Type has two harmony types', this.obj, function (it) {
        it                              ['harmony']
          .should.have.property         ('length')
            .which.                     is.exactly(2);

        it['harmony']
          .forEach(function             (eachHarmonyItem) {
            eachHarmonyItem.should
              .have.property('_id')
                .which.                 is.an.ObjectID;
          });
        });

    }

    ///////////////////////////////////////////////////////////////////////////


  }

  module.exports = assertType;

} ();
