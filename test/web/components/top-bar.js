'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';

class TopBar extends Describe {

  constructor () {
    super('Top Bar Component', {
      'connect to mongo'  :   true,
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this
      .assert(
        'Top bar should be visible',
        { visible: '.topbar' }
      )

      .assert(
        'Top bar should have a right section',
        { visible: '.topbar-right' }
      )

      .assert(
        'Top bar should have a container to display number of online users',
        { visible: 'button.online-now' }
      )

      .assert(
        'There should be at least 0 user online now',
        { text: 'span.online-users' },
        text => { (+text).should.be.a.Number.and.is.above(0) }
      )

      .assert(
        'Top bar should have a login button',
        { visible: 'button.login-button' }
      )

      .assert(
        'Top bar should have a join button',
        { visible: 'button.join-button' }
      )

      .assert(
        'Top bar should **not** have a link to profile page',
        { hidden: 'a[title="Profile"]' }
      );
  }

}

export default TopBar;
