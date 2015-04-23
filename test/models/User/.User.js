! function () {
  
  'use strict';

  var should  =   require('should');

  var assert  =   require('syn/lib/util/should/add');

  function assertUser () {

    ///////////////////////////////////////////////////////////////////////////

    assert( 'ObjectID',         require('../.ObjectID'));
    
    this.params = { operator: 'to be a User'};

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.be.an.Object;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property               ('_id')
      .which.                             is.an.ObjectID;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property               ('email')
      .which.                             is.a.String;

    ///////////////////////////////////////////////////////////////////////////

    this.obj
      .should.have.property               ('password')
      .which.                             is.a.String;

    ///////////////////////////////////////////////////////////////////////////

  }

  module.exports = assertUser;

} ();
