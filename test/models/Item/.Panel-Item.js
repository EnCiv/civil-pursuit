! function () {
  
  'use strict';

  var should  =   require('should');

  require('syn/lib/util/should/describe');

  var assert  =   require('syn/lib/util/should/add');

  function assertPanelItem () {

    ///////////////////////////////////////////////////////////////////////////

    this.params = { operator: 'to be a Panel Item' };

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
      .should.have.property           ('id')
        .which.                       is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('subject')
        .which.                       is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('description')
        .which.                       is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('link')
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
        .which.                       is.a.Type;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('user')
        .which.                       is.an.Object;

    this.obj                          ['user']
      .should.have.                   property('_id')
          .which.                     is.an.ObjectID;

    if ( this.obj['user']['full name'] ) {

      this.obj                        ['user']
        .should.have.                 property('full name')
          .which.                     is.a.String;
    }

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Popularity is a thing",

      this.obj                        ['popularity'],

      function (it) {
        it.should.be.ok.and.          is.an.Object;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Popularity's number should be a number between 0 and 100",

      this.obj                        ['popularity'],

      function (it) {
        it.should.have.               property('number')
          .which.                       is.a.Number
          .and.                         is.above(-1)
          .and.                         is.below(101);
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Popularity's views should be a positive integer",

      this.obj                        ['popularity'],

      function (it) {
        it.should.have.               property('views')
          .which.                       is.a.Number
          .and.                         is.not.Infinity
          .and.                         is.above(-1);
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Popularity's promotions should be a positive integer",

      this.obj                        ['popularity'],

      function (it) {
        it.should.have.               property('promotions')
          .which.                       is.a.Number
          .and.                         is.not.Infinity
          .and.                         is.above(-1);
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Popularity's views should be greater than or equal to popularity's promotions",

      this.obj                        ['popularity'],

      function (it) {
        it.should.have.               property('views')
          .which.                       is.above(this.obj.promotions - 1);
      
      }.bind(this));

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Popularity should be ok",

      this.obj                        ['popularity'],

      function (it) {
        it.should.have.               property('ok')
          .which.                       is.true;
      
      }.bind(this));

    ///////////////////////////////////////////////////////////////////////////


  }

  module.exports = assertPanelItem;

} ();
