'use strict';

import should from 'should';
import Milk from 'syn/lib/app/milk';
import config from 'syn/config.json';
import JoinTest from '../components/join';
import VexTest from '../components/vex';

class TopBar extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Top Bar', options);

    this.props = props;

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    let get = this.get.bind(this);

    // Get cookie

    this.set('Cookie', () => this.getCookie('synuser'));

    // Set Selectors

    this.set('Topbar',            () => this.find('.topbar'));
    this.set('Right',             () => this.find('.topbar-right'));
    this.set('Login button',      () => this.find('button.login-button'));
    this.set('Join button',       () => this.find('button.join-button'));
    this.set('Online now',        () => this.find('button.online-now'));
    this.set('Users online',      () => this.find('span.online-users'));
    this.set('Link to Profile',   () => this.find('a[title="Profile"]'));
    this.set('Link to Sign Out',  () => this.find('a[title="Sign out"]'));
    this.set('Join',              () => this.find(JoinTest.find('main')));

    // Main

    this.ok(() => get('Topbar').is(':visible'));

    // Right

    this.ok(() => get('Right').is(':visible'));

    // Online users

    if ( this.options.viewport === 'tablet' ) {
      this
        .ok(() => get('Online now').is(':visible'))
        .ok(() => get('Users online').text()
          .then(text => (+text).should.be.a.Number.and.is.above(-1))
        );
    }

    // Links

    this
      .ok(() => get('Link to Profile').is(
        get('Cookie') ? ':visible' : ':hidden'
      ))
      .ok(() => get('Link to Sign Out').is(
        get('Cookie') ? ':visible' : ':hidden'
      ));

    // Login Button

    this.ok(() => get('Login button').is(!get('Cookie')));

    // Join Button

    this.ok(() => get('Join button').is(!get('Cookie')));

    // Join Button - Vex

    this.import(VexTest,
      { trigger: 'button.join-button' },
      null,
      when => ! get('Cookie')
    );

    // Join Button - Toggle Join

    this
      .ok(() => get('Join button').click(), null, when => ! get('Cookie'))
      .wait(1, null, when => ! get('Cookie'))
      .ok(() => get('Join').is(true), null, when => ! get('Cookie'))

      .ok(() => get('Join button').click(), null, when => ! get('Cookie'))
      .wait(1, null, when => ! get('Cookie'))
      .ok(() => get('Join').is(false), null, when => ! get('Cookie'));
  }

}

export default TopBar;
