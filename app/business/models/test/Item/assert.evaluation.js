! function () {
  
  'use strict';

  var src     =   require(require('path').join(process.cwd(), 'src'));

  var should  =   require('should');

  try {
    should.Assertion.add('item', src('models/test/Item/assert'), true);
    should.Assertion.add('criteria', src('models/test/Criteria/assert'), true);
  }
  catch ( error ) {
    // Assertion item already loaded
  }

  function assertItem () {

    var self = this;
    
    this.params = { operator: 'to be an Evaluation'};

    this.obj
      .should.be.an.Object;

    this.obj
      .should.have.property('type')
        .which.is.a.String;

    this.obj
      .should.have.property('item');

    this.obj
      .item.constructor.name
        .should.be.exactly('ObjectID');

    this.obj
      .should.have.property('items')
        .which.is.an.Array;

    this.obj
      .items.forEach(function (item) {
        item.should.be.an.item;
      });

    this.obj
      .items.forEach(function (item) {
        if ( item._id === self.obj.item ) {
          throw new Error('Item evaluated with itself');
        }
      });

    this.obj
      .should.have.property('criterias')
        .which.is.an.Array;

    this.obj
      .criterias.forEach(function (criteria) {
        criteria.should.be.a.criteria;
      });

    this.obj
      .criterias.forEach(function (criteria) {
        criteria.type.should.be.exactly(self.obj.type);
      });

  }

  module.exports = assertItem;

} ();
