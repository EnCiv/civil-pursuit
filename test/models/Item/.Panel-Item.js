! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  function assertPanelItem () {

    var self = this;

    console.log()
    console.log(' .::. Asserting Panel Item .::.');
    console.log()

    ///////////////////////////////////////////////////////////////////////////

    assert('Item', require('./.Item'));
    
    this.params = { operator: 'to be a Panel Item' };

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Object;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Item;

    ///////////////////////////////////////////////////////////////////////////


  }

  module.exports = assertPanelItem;

} ();
