! function () {
  
  'use strict';

  var Form = require('./Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function join () {
    var signForm = $('form[name="join"]');

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

  module.exports = join;

} ();
