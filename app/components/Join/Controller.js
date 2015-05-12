! function () {
  
  'use strict';

  var Form = require('syn/lib/util/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function join ($vexContent) {
    var $form = $('form[name="join"]');

    $form.find('.i-agree').on('click', function () {

      var agreed = $(this).find('.agreed');

      if ( agreed.hasClass('fa-square-o') ) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      }
      else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });

    var form = new Form($form);

    function join () {
      app.domain.run(function () {

        $form.find('.please-agree').addClass('hide');
        $form.find('.already-taken').hide();

        if ( form.labels.password.val() !== form.labels.confirm.val() ) {
          form.labels.confirm.focus().addClass('error');

          return;
        }
        
        if ( ! $form.find('.agreed').hasClass('fa-check-square-o') ) {
          $form.find('.please-agree').removeClass('hide');

          return;
        }

        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: form.labels.email.val(),
            password: form.labels.password.val()
          }
        })
          
          .error(function (response, state, code) {
            if ( response.status === 401 ) {
              $form.find('.already-taken').show();
            }
          })
          
          .success(function (response) {
            synapp.user = response.user;
            
            $('a.is-in').css('display', 'inline');

            $('.topbar .is-out').remove();

            vex.close($vexContent.data().vex.id);
          });

      });
    }

    form.send(join);
  }

  module.exports = join;

} ();
