! function () {
  
  'use strict';

  function Join (locals) {

    var html5 = require('syn/lib/html5');

    var Element = html5.Element;

    var Page = require('syn/lib/app/Page');
    
    return Element('.join-modal').add(
      Element('h4', { $text: 'Join with' }),

      Element('.button-group').add(
        Element('a.button', { href: Page('Sign With Facebook') }).add(
          Element('i.fa.fa-facebook'),
          Element('span', { $text: ' Facebook' })
        ),

        Element('a.button', { href: Page('Sign With Twitter') }).add(
          Element('i.fa.fa-facebook'),
          Element('span', { $text: ' Twitter' })
        )
      ),

      Element('h4', { $text: 'Join with email' }),

      Element('form', {
          novalidate  :   'novalidate',
          role        :   'form',
          method      :   'POST',
          name        :   'join'
        }).add(

        Element('.block.warning.hide.please-agree', {
          $text: 'Please agree to our Terms of service' }),

        Element('.block.warning.hide.already-taken', {
          $text: 'Email already taken' }),

        Element('.row').add(
          Element('.form-group.tablet-50.middle').add(
            Element('label', { $text: 'Email' }),

            Element('input.block', {
                type        :   'email',
                name        :   'email',
                required    :   true,
                placeholder :   'Email'
              })
          ),

          Element('.form-group.tablet-50.middle').add(
            Element('label', { $text: 'Password' }),

            Element('input.block', {
                type        :   'password',
                name        :   'password',
                required    :   true,
                placeholder :   'Password'
              })
          ),

          Element('.form-group.tablet-50.middle').add(
            Element('label', { $text: 'Confirm password' }),

            Element('input.block', {
                type        :   'password',
                name        :   'confirm',
                required    :   true,
                placeholder :   'Confirm password'
              })
          ),

          Element('.form-group.tablet-50.middle').add(
            Element('label', { $text: 'Join' }),

            Element('button.primary.join-submit.block.small', { $text: 'Join' })
          )

        ),

        Element('.i-agree').add(
          Element('button.shy', { type: 'button' }).add(
            Element('i.fa.fa-2x.fa-square-o.agreed')
          ),

          Element('span').add(
            Element('span', { $text: ' I agree to' }),

            Element('a', {
              href: Page('Terms Of Service'),
              $text: 'the terms of service'
            }),

            Element('span', { $text: '.' })
          )
        )

      )
    );

  }

  module.exports = Join;

} ();
