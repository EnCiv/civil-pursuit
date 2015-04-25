! function () {
  
  'use strict';

  var should  =   require('should');

  require('syn/lib/util/should/describe');

  var assert  =   require('syn/lib/util/should/add');

  function assertPanelItem () {

    ///////////////////////////////////////////////////////////////////////////

    this.params = { operator: 'to be a Panel Item' };

    assert ( 'Type', require('../Type/.Type'));

    // console.log('panel item', this.obj);

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Object;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property                 ('_id')
        .which.                             is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has a short ID",

      this.obj,

      function (it) {
        it.should.have.property             ('id')
          .which.                           is.a.String;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has a subject",

      this.obj,

      function (it) {
        it.should.have.property             ('subject')
          .which.                           is.a.String;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has a description",

      this.obj,

      function (it) {
        it.should.have.property             ('description')
          .which.                           is.a.String;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has a link",

      this.obj,

      function (it) {
        it.should.have.property             ('link')
          .which.                           is.a.String;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe("Panel Item has an image",

      this.obj,

      function (it) {
        it.should.have.property             ('image')
          .which.                           is.a.String
          .and.                             match(/^https?:\/\//);
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe("Panel Item has an HTML image",

      this.obj,

      function (it) {
        it.should.have.property             ('imageHTML')
          .which.                           is.a.String
          .and.                             match(/^<img/);
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has references",

      this.obj,

      function (it) {
        it.should.have.property             ('references')
          .which.                           is.an.Array;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has views",

      this.obj,

      function (it) {
        it.should.have.property             ('views')
          .which.                           is.a.Number;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has promotions",

      this.obj,

      function (it) {
        it.should.have.property             ('promotions')
          .which.                           is.a.Number;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has a type",

      this.obj,

      function (it) {
        it.should.have.property             ('type')
          .which.                           is.a.Type;
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Panel Item has a user",

      this.obj,

      function (it) {
        it.should.have.property             ('user')
            .which.                         is.an.Object;

        it.should.have.                     property('_id')
              .which.                       is.an.ObjectID;

        if ( it['user']['full name'] ) {

          it                                ['user']
            .should.have.                   property('full name')
              .which.                       is.a.String;
        }
      });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe(
      "Popularity is a thing",

      this.obj                              ['popularity'],

      function (it) {
        it.should.be.ok.and.                is.an.Object;
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

    should.$describe(
      "Children should be a number",

      this.obj,

      function (it) {
        it.should.have.               property('children')
          .which.                       is.a.Number;
      
      }.bind(this));

    ///////////////////////////////////////////////////////////////////////////

    if ( this.obj.type.harmony.length ) {

      should.$describe(
        "Harmony should be a number",

        this.obj,

        function (it) {
          it.should.have.               property('harmony')
            .which.                       is.a.Number;
        
        }.bind(this));

    }


    ///////////////////////////////////////////////////////////////////////////


  }

  module.exports = assertPanelItem;

} ();
