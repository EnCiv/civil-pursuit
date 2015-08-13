'use strict';

import React                    from 'react';
import Component                from '../lib/app/component';
import CloudinaryImage          from './util/cloudinary-image';
import Button                   from './util/button';
import Icon                     from './util/icon';
import Link                     from './util/link';
import Login                    from './login';
import Join                     from './join';

class TopBar extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      showLogin : false,
      showJoin : false
    };
  }

  toggleLogin (e) {
    if ( e ) {
      e.preventDefault();
    }

    this.setState({ showLogin : ! this.state.showLogin });

    if ( this.state.showJoin ) {
      this.setState({ showJoin : false });
    }
  }

  toggleJoin (e) {
    if ( e ) {
      e.preventDefault();
    }

    this.setState({ showJoin : ! this.state.showJoin });

    if ( this.state.showLogin ) {
      this.setState({ showLogin : false });
    }
  }

  signOut () {
    location.href = '/sign/out';
  }

  goToProfile () {
    location.href = '/page/profile';
  }

  render () {
    let { user, ready } = this.props;

    let comp = 'syn-top_bar';

    let onlineNow = this.props.online || 0;

    let right1, right2;

    if ( ready ) {
      if ( user ) {
        right1 = (
          <section className={ `${comp}-profile-button` }>
            <Button onClick={ this.goToProfile.bind(this) }>
              <Icon icon="user" />
            </Button>
          </section>
        );

        right2 = (
          <section className={ `${comp}-join_button` }>
            <Button onClick={ this.signOut.bind(this) }>
              <Icon icon="sign-out" />
            </Button>
          </section>
        );
      }
      else {
        right1 = (
          <section className={ `${comp}-login_button` }>
            <Button onClick={ this.toggleLogin.bind(this) }>Login</Button>
          </section>
        );

        right2 = (
          <section className={ `${comp}-join_button` }>
            <Button onClick={ this.toggleJoin.bind(this) }>Join</Button>
          </section>
        );
      }
    }

    return (
      <section>
        <header role="banner" className="syn-top_bar">
          <section className={ `${comp}-left` }>
            <section className={ `${comp}-image` }>
              <Link href="/">
                <CloudinaryImage id="Synaccord_logo_64x61_znpxlc.png" screen="phone-and-down" transparent />
                <CloudinaryImage id="Synaccord_logo_name_300x61_xyohja.png" screen="tablet-and-up" transparent />
              </Link>
            </section>
            <section className={ `${comp}-beta` }>beta</section>
          </section>

          <section className={ `${comp}-right` }>
            <section className={ Component.classList(this, `${comp}-online_now`, 'syn-screen-phone_and_up') }>
              Online now: { onlineNow }
            </section>

            { right1 }

            { right2 }
          </section>
        </header>

        <Login show={ this.state.showLogin } join={ this.toggleJoin.bind(this) } />
        <Join show={ this.state.showJoin } login={ this.toggleLogin.bind(this) } />
      </section>
    );
  }
}

export default TopBar;
