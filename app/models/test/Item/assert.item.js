! function () {
  
  'use strict';

  var src     =   require(require('path').join(process.cwd(), 'src'));

  var should  =   require('should');

  try {
    should.Assertion.add('item', require('syn/models/test/Item/assert'), true);
    should.Assertion.add('criteria', require('syn/models/test/Criteria/assert'), true);
  }
  catch ( error ) {
    // Assertion item already loaded
  }

  function assertEvaluation () {

    var self = this;
    
    this.params = { operator: 'to be an Evaluation'};

    this.obj
      .should.be.an.Object;

    // Evaluation's type should be a string

    this.obj
      .should.have.property('type')
        .which.is.a.String;

    // Evaluation's item should be an ObjectID

    this.obj
      .should.have.property('item');

    this.obj
      .item.constructor.name
        .should.be.exactly('ObjectID');

    // Evaluation's items should be an array

    this.obj
      .should.have.property('items')
        .which.is.an.Array;

    // ... each item should be an item

    this.obj
      .items.forEach(function (item) {
        item.should.be.an.item;
      });

    // Item should not be in items

    this.obj
      .items.forEach(function (item) {
        if ( item._id === self.obj.item ) {
          throw new Error('Item evaluated with itself');
        }
      });

    // Evaluation's criterias should be an array

    this.obj
      .should.have.property('criterias')
        .which.is.an.Array;

    // ... each criteria should be a criteria

    this.obj
      .criterias.forEach(function (criteria) {
        criteria.should.be.a.criteria;
      });

    // Evaluation's crierias type should match

    this.obj
      .criterias.forEach(function (criteria) {
        criteria.type.should.be.exactly(self.obj.type);
      });

    // Item should have a method called getPromotionPercentage

    this.obj
      .should.have.property('getPromotionPercentage')
        .which.is.a.Function;

  }

  module.exports = assertEvaluation;

} ();
