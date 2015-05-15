! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  require('syn/lib/util/should/describe');

  function assertItem () {

    var self = this;

    ///////////////////////////////////////////////////////////////////////////

    assert( 'ObjectID',           require('../.ObjectID'));
    assert( 'Type',               require('../Type/.Type'));
    
    this.params = { operator: 'to be a Criteria' };

    ///////////////////////////////////////////////////////////////////////////
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
      .should.have.property           ('description')
        .which.                       is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('type')
        .which.                       is.a.Type;


  }

  module.exports = assertItem;

} ();
