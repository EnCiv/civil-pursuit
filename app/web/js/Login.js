! function () {
  
  'use strict';

  var Form = require('./Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function login () {
    var signForm = $('form[name="login"]');

    new Form(signForm)

      .send(function () {
        var domain = require('domain').create();
        
        domain.on('error', function (error) {
          //
        });
        
        domain.run(function () {
          
          

        });
      });
  }

  module.exports = login;

} ();
