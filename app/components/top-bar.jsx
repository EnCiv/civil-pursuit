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
//          <section className={ `${comp}-profile-button` }>
            <div className="syn-top_bar-menu-item" key={ `header-menu-profile-button` } >
              <button onClick={ this.goToProfile.bind(this) }>
                <span>Profile</span>
              </button>
            </div>
 //         </section>
        );
        right2 = (
//          <section className={ selectors.sign.out.button.replace(/\./, '') }>
            <div className="syn-top_bar-menu-item">
              <button onClick={ this.signOut.bind(this) }>
                <span>Logout</span>
              </button>
            </div>
 //         </section>
        );
      }
      else {
        right1 = (
 //         <section className={ `${comp}-login_button` }>
            <div className="syn-top_bar-menu-item">
              <button onClick={ this.toggleLogin.bind(this) }>
                <span>Login</span>
              </button>
            </div>
 //         </section>
        );
        right2 = (
 //         <section className={ `${comp}-join_button` }>
            <div className="syn-top_bar-menu-item">
              <button onClick={ this.toggleJoin.bind(this) }>
                <span>Join</span>
              </button>
            </div>
//          </section>
        );
      }
    // }

    let menustrip = menus.map( (menu, index) => (
      <div className="syn-top_bar-menu-item" key={ `header-menu-${index}` } >
        <a href={ menu.link } >
          <span> { menu.title }</span>
        </a>
      </div>
    ));

    menustrip.push(right1);
    menustrip.push(right2);

    return (
      <section>
        <header role="banner" className="syn-top_bar-wrapper">
          <section className= "syn-top_bar">
            <section className= "syn-top_bar-info">
              <section className={ `${comp}-left` }>
                <section className={ `${comp}-image` }>
                    <a href="/">
                      <CloudinaryImage id="Synaccord_logo_64x61_znpxlc.png" transparent/>
                    </a>
                </section>
                <section className={ `${comp}-logo` }><p>Civil Pursuit<sub>TM</sub></p></section>
              </section>
              <section className='syn-top_bar-center'>
                <span>Unpolarize Politics</span>
              </section>
              <section className={ `${comp}-right` }>
                <section className={ `${comp}-beta` }>Beta</section>
                <section className={ 'syn-top_bar-hamburger', 'syn-screen-phone_and_down' } ref="hamburger">
                  <Button onClick={ this.headerMenuHandler.bind(this) }>
                    <Icon icon="bars" />
                  </Button>
                </section>
              </section>
            </section>
            <section className="syn-top_bar-menu-row">
              { menustrip }
            </section>
          </section>
        </header>

        <Login show={ this.state.showLogin } join={ this.toggleJoin.bind(this) } forgot-password={ this.toggleForgotPassword.bind(this) } />
        <Join show={ this.state.showJoin } login={ this.toggleLogin.bind(this) } />
        <ForgotPassword show={ this.state.showForgotPassword } login={ this.toggleLogin.bind(this) } join={ this.toggleJoin.bind(this) } />
      </section>
    );
  }
}

// moved this out of render - return because I couldn't comment it out.
//              <section className={ Component.classList(this, `${comp}-online_now`, 'syn-screen-phone_and_up') }>
//                Online now: { onlineNow }
//              </section>
export default TopBar;
