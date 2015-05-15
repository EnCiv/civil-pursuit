! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  require('syn/lib/util/should/describe');

  function assertEvaluation () {

    var self = this;
    
    this.params = { operator: 'to be an Evaluation'};

    assert( 'ObjectID',           require('../.ObjectID'));
    assert( 'Criteria',           require('../Criteria/.Criteria'));
    assert( 'Item',               require('./.Item'));

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('type')
        .which.                       is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('item')
        .which.                       is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('criterias')
        .which.                       is.an.Array;

    ///////////////////////////////////////////////////////////////////////////

    this.obj.criterias.forEach(function (criteria) {
      criteria.should.be.a.Criteria;
    });

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property           ('items')
        .which.                       is.an.Array;

    ///////////////////////////////////////////////////////////////////////////

    this.obj.items.forEach(function (item) {
      item.should.be.an.Item;
    });

    ///////////////////////////////////////////////////////////////////////////

    should.$describe('Evaluated item should be in list of item',
      this.obj,
      function (it) {
        it.items.some(function (item) {
          return item._id.toString() === it.item.toString();
        }).should.be.true;
      });


    // // Evaluation's item should be an ObjectID

    // this.obj
    //   .should.have.property('item');

    // this.obj
    //   .item.constructor.name
    //     .should.be.exactly('ObjectID');

    // // Evaluation's items should be an array

    // this.obj
    //   .should.have.property('items')
    //     .which.is.an.Array;

    // // ... each item should be an item

    // this.obj
    //   .items.forEach(function (item) {
    //     item.should.be.an.item;
    //   });

    // // Item should not be in items

    // this.obj
    //   .items.forEach(function (item) {
    //     if ( item._id === self.obj.item ) {
    //       throw new Error('Item evaluated with itself');
    //     }
    //   });

    // // Evaluation's criterias should be an array

    // this.obj
    //   .should.have.property('criterias')
    //     .which.is.an.Array;

    // // ... each criteria should be a criteria

    // this.obj
    //   .criterias.forEach(function (criteria) {
    //     criteria.should.be.a.criteria;
    //   });

    // // Evaluation's crierias type should match

    // this.obj
    //   .criterias.forEach(function (criteria) {
    //     criteria.type.should.be.exactly(self.obj.type);
    //   });

  }

  module.exports = assertEvaluation;

} ();
