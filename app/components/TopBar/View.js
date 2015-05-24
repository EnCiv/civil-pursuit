'use strict';

import {Element} from 'cinco';
import config from 'syn/config';
import Page from 'syn/lib/app/Page';

class TopBar extends Element {
  
  constructor (props) {
    super('.topbar');
    this.props = props || {};

    this.add(
      this.rightButtons(),
      this.logo()
    );
  }

  rightButtons () {
    return new Element('.topbar-right.hide').add(
      this.onlineNow(),
      this.loginButton(),
      this.profileLink(),
      this.signOutLink(),
      this.joinButton()
    );
  }

  onlineNow () {
    return new Element('button.online-now').add(
      new Element('span').text('Online now: '),
      new Element('span.online-users')
    );
  }

  loginButton () {
    return new Element('button.is-out.login-button')
      .condition(! this.props.user)
      .add(
        new Element('b').text('Login')
      );
  }

  profileLink () {
    return new Element('a.button.is-in', {
      href   :   Page('Profile'),
      title  :   'Profile'
    })
      .add(
        new Element('i.fa.fa-user')
      )
  }

  signOutLink () {
    return new Element('a.button.is-in', {
        href    :   Page('Sign Out'),
        title   :   'Sign out'
      })
      .add(
        new Element('i.fa.fa-sign-out')
      );
  }

  joinButton () {
    return new Element('button.is-out.join-button')

      .condition(! this.props.user)

      .add(new Element('b').text('Join'));
  }

  logo () {
    return new Element('#logo').add(
      this.logoLink(),
      this.beta()
    );
  }

  logoLink () {
    return new Element('a.pull-left', {
      href: '/',
      'date-toggle':'tooltip',
      'data-placement': 'bottom',
      'title': 'Synaccord'
    })

      .add(
        new Element('img.img-responsive.logo-full', {
          alt   :   'Synapp',
          src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_name_300x61_xyohja.png'
        }),

        new Element('img.img-responsive.logo-image.hide', {
          alt   :   'Synapp',
          src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_64x61_znpxlc.png'
        })
      );
  }

  beta () {
    return new Element('a.beta', { href: '/'  }).text('Beta');
  }

}

export default TopBar;
