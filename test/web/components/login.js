'use strict';

import should from 'should';
import Milk from 'syn/lib/app/milk';
import UserModel from 'syn/models/User';

class Login extends Milk {

  static find (name) {
    switch ( name ) {
      case 'main'     : return '.login-modal';
      
      case 'form'     : return Login.find('main') + ' form[name="login"]';
      
      case 'email'    : return Login.find('form') +
        ' input[type="email"][name="email"]';
      
      case 'password' : return Login.find('form') +
        ' input[type="password"][name="password"]';
      
      case 'submit'   : return Login.find('form') + ' button.login-submit';
      
      case '404'      : return Login.find('form') + ' .login-error-404';

      case '401'      : return Login.find('form') + ' .login-error-401';
    }
  }

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Login', options);

    this.props = props || {};

    let get = this.get.bind(this);

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    if ( this.props.toggled === false ) {
      this.ok(() => this.find('.login-button').click());
      this.wait(1);
    }

    this

      // Create test user from DB

      .set('User', () => UserModel.disposable())

      // Set DOM selectors

      .set('Main',        () => this.find(Login.find('main')))
      .set('Form',        () => this.find(Login.find('form')))
      .set('Email',       () => this.find(Login.find('email')))
      .set('Password',    () => this.find(Login.find('password')))
      .set('Submit',      () => this.find(Login.find('submit')))
      .set('404',         () => this.find(Login.find('404')))
      .set('401',         () => this.find(Login.find('401')))

      // Visibility

      .ok(() => get('Main')         .is(':visible'), 'Login is visible')
      .ok(() => get('Form')         .is(':visible'), 'Form is visible')
      .ok(() => get('Email')        .is(':visible'), 'Email field is visible')
      .ok(() => get('Password')     .is(':visible'), 'Password field is visible')
      .ok(() => get('Submit')       .is(':visible'), 'Submit button is visible')

      .ok(() => get('401')  .not(':visible'), '401 Alert is not visible')
      .ok(() => get('404')  .not(':visible'), '404 Alert is not visible')


      // VALIDATIONS

      // Missing email

      .ok(() => get('Submit')       .click(), 'Submit Login')
      .ok(() => get('Email')        .is('.error'), 'Email is complaining because empty')

      // Missing password

      .ok(() => get('Email')        .val('##### fake user #####'), 'Entering fake email')
      .ok(() => get('Submit')       .click(), 'Submit Login')
      .ok(() => get('Email')        .not('.error'), 'Email is not complaining anymore')
      .ok(() => get('Password')     .is('.error'), 'Password is complaining because it is empty')

      // Validations OK

      .ok(() => get('Password')     .val('####'), 'Enetring fake password')
      .ok(() => get('Submit')       .click(), 'Submit Login')
      .ok(() => get('Email')        .not('.error'), 'Email is not complaining')
      .ok(() => get('Password')     .not('.error'), 'Password is not complaining')

      // User not found

      .ok(() => get('Submit').click(), 'Submit form')
      .wait(1)
      .ok(() => get('404').is(':visible'), '404 alert (email not found) is visible')
      .ok(() => get('401').not(':visible'), '401 alert (wrong password) is hidden')

      // Wrong password

      .ok(() => get('Email').val(get('User').email), 'Entering real email')
      .ok(() => get('Submit').click(), 'Submit Login')
      .wait(2)
      .ok(() => get('401').is(':visible'), '401 alert (wrong password) is visible')
      .ok(() => get('404').not(':visible'), '404 alert (email not found) is hidden')

      // OK
      .ok(() => get('Password').val('1234'), 'Setting real password')
      .ok(() => get('Submit').click(), 'Submit loging')
      .wait(2)
      .ok(() => get('401').is(false), '401 alert (wrong password) is hidden')
      .ok(() => get('404').is(false), '404 alert (email not found) is hidden')
      .ok(() => get('Main').is(false), 'Login is visible')


      // UI is now for signed-in users

      .wait(1)
      .ok(() => get('Main').is(false))
    ;
  }

  clean () {
    let User = this.get('User');

    if ( User ) {
      // User.remove();
    }
  }
}

export default Login;
