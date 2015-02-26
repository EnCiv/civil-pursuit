! function () {
  
  'use strict';

  var Form = require('./Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function join () {
    var $form = $('form[name="join"]');

    $form.find('.i-agree').on('click', function () {
      console.warn('dhsdjk')

      var agreed = $(this).find('.agreed');

      if ( agreed.hasClass('fa-square-o') ) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      }
      else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });

    new Form($form)

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
