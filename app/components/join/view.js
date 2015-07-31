'use strict';

import {Element, Elements} from 'cinco/dist';
import Page from '../../lib/app/page';

class Join extends Element {

  signWithFacebook () {
    return new Element('a.button', { href: Page('Sign With Facebook') }).add(
      new Element('i.fa.fa-facebook'),
      new Element('span').text(' Facebook')
    );
  }

  signWithTwitter () {
    return new Element('a.button', { href: Page('Sign With Twitter') }).add(
      new Element('i.fa.fa-twitter'),
      new Element('span').text(' Twitter')
    );
  }

  email () {
    return new Element('.form-group.tablet-50.middle').add(
      new Element('label').text('Email'),

      new Element('input.block', {
          type        :   'email',
          name        :   'email',
          required    :   true,
          placeholder :   'Email'
        })
    );
  }

  password () {
    return new Element('.form-group.tablet-50.middle').add(
      new Element('label').text('Password'),

      new Element('input.block', {
          type        :   'password',
          name        :   'password',
          required    :   true,
          placeholder :   'Password'
        })
    );
  }

  confirm () {
    return new Element('.form-group.tablet-50.middle').add(
      new Element('label').text('Confirm password'),

      new Element('input.block', {
          type        :   'password',
          name        :   'confirm',
          required    :   true,
          placeholder :   'Confirm password'
        })
    );
  }

  submit () {
    return new Element('.form-group.tablet-50.middle').add(
      new Element('label').text('Join'),

      new Element('button.primary.join-submit.block.small')
        .text('Join')
    );
  }

  iAgree () {
    return new Element('.i-agree').add(
      new Element('button.shy', { type: 'button' }).add(
        new Element('i.fa.fa-2x.fa-square-o.agreed')
      ),

      new Element('span').add(
        new Element('span').text(' I agree to'),

        new Element('a', {
          href: Page('Terms Of Service')
        }).text('the terms of service'),

        new Element('span').text('.')
      )
    );
  }

  login () {
    return new Element('h5.text-center').add(
      new Element('span').text('Already a member? '),
      new Element('a.join-link_to_login', { href: '#' }).text('Log in')
    );
  }

  form () {
    return new Element('form', {
      novalidate  :   'novalidate',
      role        :   'form',
      method      :   'POST',
      name        :   'join'
    })

      .add(

        new Element('.block.warning.hide.please-agree')
          .text('Please agree to our Terms of service'),

        new Element('.block.warning.hide.already-taken')
          .text('Email already taken'),

        new Element('.row').add(
          this.email(),

          this.password(),

          this.confirm(),

          this.submit()
        ),

        this.iAgree(),

        this.login()

      )
  }

  constructor (props) {
    super('.join-modal')

    this.add(
      new Element('h4').text('Join with'),

      new Element('.button-group').add(
        this.signWithFacebook(),
        this.signWithTwitter()
      ),

      new Element('h4').text('Join with email'),

      this.form()
    );
  }

}

export default Join
