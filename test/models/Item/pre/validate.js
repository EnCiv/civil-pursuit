! function () {
  
  'use strict';

  require('should');

  var preValidate;

  describe ( 'Models / Item / Pre / validate' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      preValidate = require('syn/models/Item/pre/validate');

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a function' , function () {

      preValidate.should.be.a.Function;

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should call next' , function (done) {

      preValidate(done);

    } );

    ///////////////////////////////////////////////////////////////////////////

  } );

} ();
