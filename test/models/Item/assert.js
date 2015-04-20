! function () {
  
  'use strict';

  var should  =   require('should');

  function assertItem () {
    
    this.params = { operator: 'to be an Item'};

    this.obj
      .should.be.an.Object;

    this.obj
      .should.have.property('_id');

    this.obj
      ._id
        .constructor.name
          .should.be.exactly('ObjectID');

    this.obj
      .should.have.property('created')
        .which.is.an.instanceof(Date);

    this.obj
      .should.have.property('edited')
        .which.is.an.instanceof(Date);

    this.obj
      .should.have.property('views')
        .which.is.a.Number;

    this.obj
      .should.have.property('promotions')
        .which.is.a.Number;

    this.obj
      .should.have.property('type')
        .which.is.a.String;

    this.obj
      .should.have.property('subject')
        .which.is.a.String;

    this.obj
      .should.have.property('description')
        .which.is.a.String;

    this.obj
      .should.have.property('references')
        .which.is.an.Array;

    this.obj
      .should.have.property('user')
        .which.is.an.Object;

  }

  module.exports = assertItem;

} ();
