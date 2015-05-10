! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  require('syn/lib/util/should/describe');

  function assertItem () {

    var self = this;

    ///////////////////////////////////////////////////////////////////////////

    assert( 'ObjectID',           require('../.ObjectID'));
    assert( 'Item',               require('../Item/.Item'));
    assert( 'Criteria',           require('../Criteria/.Criteria'));
    assert( 'User',               require('../User/.User'));
    
    this.params = { operator: 'to be a Vote'};

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
      "Vote is related to an item",

      this.obj,

      function (it) {
        it.should.have.property       ('item')
            .which.                   is.an.Item;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Vote is related to a user",

      this.obj,

      function (it) {
        it.should.have.property       ('user')
            .which.                   is.a.User;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Vote is related to a criteria",

      this.obj,

      function (it) {
        it.should.have.property       ('criteria')
            .which.                   is.a.Criteria;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Vote has a value",

      this.obj,

      function (it) {
        it.should.have.property       ('value')
            .which.                   is.a.Number;
      });

    ///////////////////////////////////////////////////////////////////////////

  }

  module.exports = assertItem;

} ();
