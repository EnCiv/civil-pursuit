! function () {
  
  'use strict';

  var should  =   require('should');

  function assertObjectID () {

    var self = this;
    
    this.params = { operator: 'to be an ObjectID'};

    this.obj
      .should.be.an.Object;

    this.obj
      .constructor.name
      .should.be.exactly('ObjectID');

  }

  module.exports = assertObjectID;

} ();
