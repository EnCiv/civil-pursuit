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
        
      });
  }

  module.exports = login;

} ();
