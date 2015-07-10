'use strict';

import should       from 'should';
import Milk         from '../../../lib/app/milk';
import UserModel    from '../../../models/user';

class Join extends Milk {

  static find (name) {
    switch ( name ) {
      case 'main'     : return '.join-modal';
      
      case 'form'     : return Join.find('main') + ' form[name="join"]';
      
      case 'email'    : return Join.find('form') +
        ' input[type="email"][name="email"]';
      
      case 'password' : return Join.find('form') +
        ' input[type="password"][name="password"]';
      
      case 'confirm'  : return Join.find('form') +
        ' input[type="password"][name="confirm"]';
      
      case 'submit'   : return Join.find('form') + ' button.join-submit';
      
      case 'agree'   : return Join.find('form') + ' .i-agree .agreed';

      case 'agree alert': return Join.find('form') + ' .please-agree.warning';

      case 'exists': return Join.find('form') + ' .already-taken.warning';
    }
  }

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Join', options);

    this.props = props || {};

    let get = this.get.bind(this);

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    if ( this.props.toggled === false ) {
      this.ok(() => this.find('.join-button').click());
      this.wait(1);
    }

    this

      // Create test user from DB

      .set('User', () => UserModel.disposable())

      // User to create

      .set('My email', 'test-test@test-' + Date.now() + '.com')
      .set('My password', Date.now())

      // Set DOM selectors

      .set('Main',        () => this.find(Join.find('main')))
      .set('Form',        () => this.find(Join.find('form')))
      .set('Email',       () => this.find(Join.find('email')))
      .set('Password',    () => this.find(Join.find('password')))
      .set('Confirm',     () => this.find(Join.find('confirm')))
      .set('Submit',      () => this.find(Join.find('submit')))
      .set('Agree',       () => this.find(Join.find('agree')))
      .set('Agree alert', () => this.find(Join.find('agree alert')))
      .set('Exists',      () => this.find(Join.find('exists')))

      // Visibility

      .ok(() => get('Main')         .is(':visible'))
      .ok(() => get('Form')         .is(':visible'))
      .ok(() => get('Email')        .is(':visible'))
      .ok(() => get('Password')     .is(':visible'))
      .ok(() => get('Confirm')      .is(':visible'))
      .ok(() => get('Submit')       .is(':visible'))

      .ok(() => get('Agree alert')  .not(':visible'))


      // VALIDATIONS

      // Missing email

      .ok(() => get('Submit')       .click())
      .ok(() => get('Email')        .is('.error'))

      // Missing password

      .ok(() => get('Email')        .val(get('User').email))
      .ok(() => get('Submit')       .click())
      .ok(() => get('Email')        .not('.error'))
      .ok(() => get('Password')     .is('.error'))

      // Missing confirm

      .ok(() => get('Password').val('abc'))
      .ok(() => get('Submit').click())
      .ok(() => get('Email').not('.error'))
      .ok(() => get('Password').not('.error'))
      .ok(() => get('Confirm').is('.error'))

      // Password and confirm don't match

      .ok(() => get('Confirm').val('123'))
      .ok(() => get('Submit').click())
      .ok(() => get('Email').not('.error'))
      .ok(() => get('Password').not('.error'))
      .ok(() => get('Confirm').is('.error'))

      // User did not agree

      .ok(() => get('Confirm').val('abc'))
      .ok(() => get('Submit').click())
      .ok(() => get('Email').not('.error'))
      .ok(() => get('Password').not('.error'))
      .ok(() => get('Confirm').not('.error'))
      .ok(() => get('Agree alert')  .is(':visible'))

      // Agree

      .ok(() => get('Agree').click())
      .ok(() => get('Agree').is('.fa-check-square-o'))

      // User already taken

      .ok(() => get('Submit').click())
      .wait(1)
      .ok(() => get('Exists').is(':visible'))

      // Create user

      .ok(() => get('Email').val(get('My email')))
      .ok(() => get('Password').val(get('My password')))
      .ok(() => get('Confirm').val(get('My password')))
      .ok(() => get('Submit').click())

      // UI is now for signed-in users

      .wait(1)
      .ok(() => get('Main').is(false))
    ;
  }

  clean () {
    let User = this.get('User');

    if ( User ) {
      User.remove();
    }
  }
}

export default Join;
