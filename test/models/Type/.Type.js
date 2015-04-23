! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  function assertType () {

    var self = this;

    ///////////////////////////////////////////////////////////////////////////

    assert('ObjectID', require('../.ObjectID'));
    
    this.params = { operator: 'to be a Type' };

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Object;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('_id')
        .which.                       is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('name')
        .which.                       is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('harmony')
        .which.                       is.an.Array;

    ///////////////////////////////////////////////////////////////////////////

    if ( this.obj.parent ) {
      this.obj
        .should.have.property         ('parent')
          .which.                     is.an.ObjectID;
    }

    ///////////////////////////////////////////////////////////////////////////

    if ( this.obj.harmony.length ) {

      this.obj                        ['harmony']
        .should.have.property         ('length')
          .which.                     is.exactly(2);

      this.obj['harmony']
        .forEach(function             (eachHarmonyItem) {
          eachHarmonyItem
            .should.be.ok.and.        is.an.ObjectID;
        });

    }

    ///////////////////////////////////////////////////////////////////////////


  }

  module.exports = assertType;

} ();
