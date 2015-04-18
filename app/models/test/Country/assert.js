! function () {
  
  'use strict';

  var src     =   require(require('path').join(process.cwd(), 'src'));

  var should  =   require('should');

  // try {
  //   should.Assertion.add('item', src('models/test/Item/assert'), true);
  //   should.Assertion.add('criteria', src('models/test/Criteria/assert'), true);
  // }
  // catch ( error ) {
  //   // Assertion item already loaded
  // }

  function assertEvaluation () {

    var self = this;
    
    this.params = { operator: 'to be a Country'};

    this.obj
      .should.be.an.Object;

    this.obj
      .should.have.property('_id')
      .which.is.an.Object;

    this.obj
      ._id.constructor.name
      .should.be.exactly('ObjectID');

    this.obj
      .should.have.property('name')
      .which.is.a.String;

  }

  module.exports = assertEvaluation;

} ();
