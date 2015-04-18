! function () {
  
  'use strict';

  var should  =   require('should');

  function assertItem () {
    
    this.params = { operator: 'to be a Criteria'};

    this.obj
      .should.be.an.Object;

    this.obj
      .should.have.property('_id');

    this.obj
      ._id
        .constructor.name
          .should.be.exactly('ObjectID');

    this.obj
      .should.have.property('type')
        .which.is.a.String;

    this.obj
      .should.have.property('name')
        .which.is.a.String;

    this.obj
      .should.have.property('description')
        .which.is.a.String;

  }

  module.exports = assertItem;

} ();
