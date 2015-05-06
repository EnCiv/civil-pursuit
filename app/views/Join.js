! function () {
  
  'use strict';

  function Join (locals) {

    var html5 = require('syn/lib/html5');

    var __ = html5.Element;

    var Page = require('syn/lib/Page');
    
    return __('.join-modal').add(
      __('h4', { $text: 'Join with' }),

      __('.button-group').add(
        __('a.button', { href: Page('Sign With Facebook') }).add(
          __('i.fa.fa-facebook'),
          __('span', { $text: ' Facebook' })
        ),

        __('a.button', { href: Page('Sign With Twitter') }).add(
          __('i.fa.fa-facebook'),
          __('span', { $text: ' Twitter' })
        )
      ),

      __('h4', { $text: 'Join with email' }),

      __('form', {
          novalidate  :   'novalidate',
          role        :   'form',
          method      :   'POST',
          name        :   'join'
        }).add(

        __('.block.warning.hide.please-agree', {
          $text: 'Please agree to our Terms of service' }),

        __('.block.warning.hide.already-taken', {
          $text: 'Email already taken' }),

        __('.row').add(
          __('.form-group.tablet-50.middle').add(
            __('label', { $text: 'Email' }),

            __('input.block', {
                type        :   'email',
                name        :   'email',
                required    :   true,
                placeholder :   'Email'
              })
          ),

          __('.form-group.tablet-50.middle').add(
            __('label', { $text: 'Password' }),

            __('input.block', {
                type        :   'password',
                name        :   'password',
                required    :   true,
                placeholder :   'Password'
              })
          ),

          __('.form-group.tablet-50.middle').add(
            __('label', { $text: 'Confirm password' }),

            __('input.block', {
                type        :   'password',
                name        :   'confirm',
                required    :   true,
                placeholder :   'Confirm password'
              })
          ),

          __('.form-group.tablet-50.middle').add(
            __('label', { $text: 'Join' }),

            __('button.primary.join-submit.block.small', { $text: 'Join' })
          )

        )

      )
    );

  }

  module.exports = Join;

} ();
