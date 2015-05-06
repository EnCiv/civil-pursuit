! function () {
  
  'use strict';

  function Join (locals) {

    var html5 = require('syn/lib/html5');

    var h5$ = html5.Element;

    var Page = require('syn/lib/Page');
    
    return h5$('.join-modal').add(
      h5$('h4', { $text: 'Join with' }),

      h5$('.button-group').add(
        h5$('a.button', { href: Page('Sign With Facebook') }).add(
          h5$('i.fa.fa-facebook'),
          h5$('span', { $text: ' Facebook' })
        ),

        h5$('a.button', { href: Page('Sign With Twitter') }).add(
          h5$('i.fa.fa-facebook'),
          h5$('span', { $text: ' Twitter' })
        )
      ),

      h5$('h4', { $text: 'Join with email' }),

      h5$('form', {
          novalidate  :   'novalidate',
          role        :   'form',
          method      :   'POST',
          name        :   'join'
        }).add(

        h5$('.block.warning.hide.please-agree', {
          $text: 'Please agree to our Terms of service' }),

        h5$('.block.warning.hide.already-taken', {
          $text: 'Email already taken' }),

        h5$('.row').add(
          h5$('.form-group.tablet-50.middle').add(
            h5$('label', { $text: 'Email' }),

            h5$('input.block', {
                type        :   'email',
                name        :   'email',
                required    :   true,
                placeholder :   'Email'
              })
          ),

          h5$('.form-group.tablet-50.middle').add(
            h5$('label', { $text: 'Password' }),

            h5$('input.block', {
                type        :   'password',
                name        :   'password',
                required    :   true,
                placeholder :   'Password'
              })
          ),

          h5$('.form-group.tablet-50.middle').add(
            h5$('label', { $text: 'Confirm password' }),

            h5$('input.block', {
                type        :   'password',
                name        :   'confirm',
                required    :   true,
                placeholder :   'Confirm password'
              })
          ),

          h5$('.form-group.tablet-50.middle').add(
            h5$('label', { $text: 'Join' }),

            h5$('button.primary.login-submit.block.small', { $text: 'Join' })
          )

        )

      )
    );

  }

  module.exports = Join;

} ();
