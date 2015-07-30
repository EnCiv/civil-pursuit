'use strict';

import {Element} from 'cinco/dist';

class Login extends Element {

  constructor (props) {
    super('.login-modal')

    this

      .add(
        new Element('h4').text('Login'),

        new Element('form',
          {
            role        :   'form',
            method      :   'POST',
            novalidate  :   'novalidate',
            name        :   'login'
          })
          .add(
            new Element('.login-error-404.is-container').add(
              new Element('.is-section').add(
                new Element('.danger').add(
                  new Element('p').add(
                    new Element('strong').text('Wrong email')
                  )
                )
              )
            ),

            new Element('.login-error-401.is-container').add(
              new Element('.is-section').add(
                new Element('.danger').add(
                  new Element('p').add(
                    new Element('strong').text('Wrong password')
                  )
                )
              )
            ),

            new Element('.sign-success.success'),

            // Social login

            new Element('.row').add(

              // Facebook login

              new Element('.phone-50.gutter').add(
                new Element('a', { href : '/sign/facebook' }).add(
                  new Element('button.block', { type : 'button' }).add(
                    new Element('i.fa.fa-facebook'),
                    new Element('span').text(' Facebook')
                  )
                )
              ),

              // Twitter login

              new Element('.phone-50.gutter').add(
                new Element('a', { href : '/sign/twitter' }).add(
                  new Element('button.block', { type : 'button' }).add(
                    new Element('i.fa.fa-twitter'),
                    new Element('span').text(' Twitter')
                  )
                )
              )
            ),

            new Element('.form-group').add(
              new Element('label').text('Email'),

              new Element('input',
                {
                  type          :   'email',
                  placeholder   :   'Email',
                  name          :   'email',
                  required      :   'required'
                }
              )
            ),

            new Element('.form-group').add(
              new Element('label').text('Password'),

              new Element('input',
                {
                  type          :   'password',
                  placeholder   :   'Password',
                  name          :   'password',
                  required      :   'required'
                }
              )
            ),

            new Element('p').add(
              new Element('button.primary.login-submit.block').add(
                new Element('i.fa.fa-sign-in'),
                new Element('span').text('Login')
              )
            )
          ),

        new Element('h5').add(
          new Element('a.forgot-password-link', {
            href      :   '#'
          }).text('Forgot password?')
        )
      )
  }

}

export default Login;
