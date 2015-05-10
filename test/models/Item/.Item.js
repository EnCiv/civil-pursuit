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
    assert( 'User',               require('../User/.User'));
    assert( 'CloudinaryUrl',      require('../../lib/util/is/.CloudinaryUrl'));
    
    this.params = { operator: 'to be an Item'};

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Object;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('_id')
        .which.                       is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Item has a short id",

      this.obj,

      function (it) {
        it.should.have.property       ('id')
            .which.                   is.a.String;
      });

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('subject')
        .which.                       is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('description')
        .which.                       is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    if ( this.obj.image ) {

      this.obj
      .should.have.property           ('image')
        .which.                       is.a.CloudinaryUrl;

    }

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('references')
        .which.                       is.an.Array;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('views')
        .which.                       is.a.Number;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('promotions')
        .which.                       is.a.Number;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('type')
        .which.                       is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('user')
        .which.                       is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

  }

  module.exports = assertItem;

} ();
