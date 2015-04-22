! function () {
  
  'use strict';

  var should  =   require('should');

  function assertEvaluation () {

    var self = this;
    
    this.params = { operator: 'to be a User'};

    this.obj
      .should.be.an.Object;

    this.obj
      .should.have.property('_id')
      .which.is.an.Object;

    this.obj
      ._id.constructor.name
      .should.be.exactly('ObjectID');

    this.obj
      .should.have.property('email')
      .which.is.a.String;

    this.obj
      .should.have.property('password')
      .which.is.a.String;

    // this.obj
    //   .should.have.property('fullName')
    //   .which.is.a.String;

  }

  module.exports = assertEvaluation;

} ();
