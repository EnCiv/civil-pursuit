'use strict';

import React                          from 'react';
import Component                      from '../lib/app/component';
import CloudinaryImage                from './util/cloudinary-image';
import Button                         from './util/button';
import Icon                           from './util/icon';
import Login                          from './login';
import Join                           from './join';
import ForgotPassword                 from './forgot-password';
import userType                       from '../lib/proptypes/user';
import HeaderMenu                     from './header-menu';
import selectors                      from '../../selectors.json';
import menus                          from '../../fixtures/header-menu/1.json';

class TopBar extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user        :   userType,
    online      :   React.PropTypes.number
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    showLogin           :   false,
    showJoin            :   false,
    showForgotPassword  :   false
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleLogin (e) {
    if ( e ) {
      e.preventDefault();
    }

    this.setState({ showLogin : ! this.state.showLogin });

    if ( this.state.showJoin ) {
      this.setState({ showJoin : false });
    }

    if ( this.state.showForgotPassword ) {
      this.setState({ showForgotPassword : false });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleJoin (e) {
    if ( e ) {
      e.preventDefault();
    }

    this.setState({ showJoin : ! this.state.showJoin });

    if ( this.state.showLogin ) {
      this.setState({ showLogin : false });
    }

    if ( this.state.showForgotPassword ) {
      this.setState({ showForgotPassword : false });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleForgotPassword (e) {
    if ( e ) {
      e.preventDefault();
    }

    this.setState({ showForgotPassword : ! this.state.showForgotPassword });

    if ( this.state.showJoin ) {
      this.setState({ showJoin : false });
    }

    if ( this.state.showLogin ) {
      this.setState({ showLogin : false });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  signOut () {
    location.href = '/sign/out';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  goToProfile () {
    location.href = '/page/profile';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  headerMenuHandler (e) {
    e.preventDefault();

    HeaderMenu.toggle().then(
      () => {
        const hamburger = React.findDOMNode(this.refs.hamburger);
        hamburger.classList.toggle('on');
      }
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, ready } = this.props;

    let comp = 'syn-top_bar';

    let onlineNow = this.props.online || 0;

    let right1, right2;

    // if ( ready ) {
      if ( user ) {
        right1 = (
          <section className={ `${comp}-profile-button` }>
            <Button onClick={ this.goToProfile.bind(this) }>
              <Icon icon="user" />
            </Button>
          </section>
        );

        right2 = (
          <section className={ selectors.sign.out.button.replace(/\./, '') }>
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
    // }

    const menustrip = menus.map( (menu, index) => (
      <div className={syn-top_bar-menu-item} key={ `header-menu-${index}` } >
        <a href={ menu.link } >
          <span> { menu.title }</span>
        </a>
      </div>
    ));

    return (
      <section>
        <header role="banner" className="syn-top_bar">
          <section className={ `${comp}-left` }>
            <section className={ `${comp}-image` }>
                <a href="/">
                  <CloudinaryImage id="Synaccord_logo_64x61_znpxlc.png" transparent/>
                </a>
            </section>
            <section className={ `${comp}-logo` }><p>Civil Pursuit<sub>TM</sub></p></section>
            <section className={ `${comp}-beta` }>beta</section>
          </section>

          <section className={ `${comp}-right` }>
            <section className={ Component.classList(this, `${comp}-online_now`, 'syn-screen-phone_and_up') }>
              Online now: { onlineNow }
            </section>

            { right1 }

            { right2 }

            <section className="syn-top_bar-hamburger" ref="hamburger">
              <Button onClick={ this.headerMenuHandler.bind(this) }>
                <Icon icon="bars" />
              </Button>
            </section>
          </section>
          <section className="syn-top_bar-menu-row">
            { menustrip }
          </section>
        </header>

        <Login show={ this.state.showLogin } join={ this.toggleJoin.bind(this) } forgot-password={ this.toggleForgotPassword.bind(this) } />
        <Join show={ this.state.showJoin } login={ this.toggleLogin.bind(this) } />
        <ForgotPassword show={ this.state.showForgotPassword } login={ this.toggleLogin.bind(this) } join={ this.toggleJoin.bind(this) } />
      </section>
    );
  }
}

export default TopBar;
