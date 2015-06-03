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

    if ( this.props.go !== false ) {
      this.go('/');
    }

    this
      .ok(() => this.find('.topbar').is(':visible'))
      .ok(() => this.find('.topbar-right').is(':visible'))
      .ok(() => this.find('button.online-now').is(':visible'))
      .ok(() => this.find('span.online-users').text()
        .then(text => (+text).should.be.a.Number.and.is.above(-1))
      )
      .ok(() => this.find('button.login-button').is(':visible'))
      .ok(() => this.find('button.join-button').is(':visible'))
      .ok(() => this.find('a[title="Profile"]').not(':visible'))
      .ok(() => this.find('a[title="Sign out"]').not(':visible'))

      .import(VexTest, { driver : false, trigger: 'button.join-button' })

      .ok(() => this.find('button.join-button').click())
      .wait(1)
      .ok(() => this.find(JoinTest.find('main')).is(true))

      .ok(() => this.find('button.join-button').click())
      .wait(1)
      .ok(() => this.find(JoinTest.find('main')).is(false));
    ;
  }

}

export default TopBar;
