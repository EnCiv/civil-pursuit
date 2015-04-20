! function () {
  
  'use strict';

  

  var Test    =   require('syn/lib/Test');

  var Item    =   require('syn/models/Item');

  var should  =   require('should');

  function assertItem () {
    
    this.params = { operator: 'to be an Item'};

    this.obj.should.be.an.Object;

  }

  should.Assertion.add('item', assertItem);

  module.exports = assertItem;

} ();
