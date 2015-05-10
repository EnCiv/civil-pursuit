! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  require('syn/lib/util/should/describe');

  function assertItem () {

    var self = this;

    ///////////////////////////////////////////////////////////////////////////

    this.params = { operator: 'to be a Vote Accumulation'};

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Object;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('total')
        .which.                       is.a.Number;

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Accumulation has values",

      this.obj,

      function (it) {
        it.should.have.property       ('values')
            .which.                   is.an.Array;
      });

    ///////////////////////////////////////////////////////////////////////////

  }

  module.exports = assertItem;

} ();
