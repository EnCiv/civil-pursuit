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
  topStrip=[];
  topBurger=[];

  renderMenuItem(name, onClick, href){
      // on desktop the menu is a strip across the top
      this.topStrip.push(
      <div className="syn-top_bar-menu-item">
        <button onClick={onClick} >
          <a href={href}>{name}</a>
        </button>
      </div>
      );
      // on smartphone the menu is a hamber in the upper right corner
      this.topBurger.push(
        <li>
          <button onClick={onClick}>
            <a href={href}>{name}</a>
          </button>
        </li>
      );
  }

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

    let modalJoin = document.querySelector('.syn-join');
    let modalLogin = document.querySelector('.syn-login');
    let modalForgotP = document.querySelector('.syn-forgot-password');

    modalJoin.classList.remove('syn--visible');

    modalLogin.classList.toggle('syn--visible');

    modalForgotP.classList.remove('syn--visible');


  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleJoin (e) {
    if ( e ) {
      e.preventDefault();
    }


    let modalJoin = document.querySelector('.syn-join');
    let modalLogin = document.querySelector('.syn-login');
    let modalForgotP = document.querySelector('.syn-forgot-password');

    modalJoin.classList.toggle('syn--visible');

    modalLogin.classList.remove('syn--visible');

    modalForgotP.classList.remove('syn--visible');

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleForgotPassword (e) {
    if ( e ) {
      e.preventDefault();
    }

    let modalJoin = document.querySelector('.syn-join');
    let modalLogin = document.querySelector('.syn-login');
    let modalForgotP = document.querySelector('.syn-forgot-password');

    modalJoin.classList.remove('syn--visible');

    modalLogin.classList.remove('syn--visible');

    modalForgotP.classList.toggle('syn--visible');

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  signOut () {
    window.onbeforeunload=null; // stop the popup about navigating away
    location.href = '/sign/out';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  goToPage (p, e) {
    //location.href = '/page/profile';
    e.preventDefault();
    this.props.setPath(p);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  goToHref (link) {
    location.href = link;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  headerMenuHandler (e) {
    e.preventDefault();

    this.HeaderMenuToggle().then(
      () => {
        const hamburger = this.refs.hamburger;
        hamburger.classList.toggle('on');
      }
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  HeaderMenuToggle () {
    return new Promise((ok, ko) => {
      const headerMenu = document.querySelector('#syn-header-menu');

      headerMenu.classList.toggle('visible');

      if ( headerMenu.classList.contains('visible') ) {
        const headerHeight = headerMenu.offsetHeight;

        const bottom = `calc(100vh - ${(78 + headerHeight)}px)`;


        headerMenu.style.bottom = bottom;
      }

      else {
        headerMenu.style.bottom = 'calc(100vh - 73px)';
      }

      setTimeout(ok);
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, ready } = this.props;

    let comp = 'syn-top_bar';

    let onlineNow = this.props.online || 0;

    this.renderMenuItem("Challenges",this.goToPage.bind(this, '/'), '/' )
    this.renderMenuItem("About",this.goToPage.bind(this, '/about'),'/about');
    this.renderMenuItem("Blog",this.goToHref.bind(this, "https://synaccord.wordpress.com/"),"https://synaccord.wordpress.com/")
    if(user) {
      this.renderMenuItem("Profile",this.goToPage.bind(this, '/page/profile'),'/page/profile');
      this.renderMenuItem("Logout",this.signOut.bind(this),'/sign/out');
    } else {
      this.renderMenuItem("Login",this.toggleLogin.bind(this), '/' );
      this.renderMenuItem("Join",this.toggleJoin.bind(this), '/' );      
    }

    
    return (
      <section>
        <header role="banner" className="syn-top_bar-wrapper">
          <div className="syn-top_bar-wrapper-inner">
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
                <section className={ `${comp}-right` }>
                  <section className={ `${comp}-beta` }>Beta</section>
                  <section className={ 'syn-top_bar-hamburger'} ref="hamburger">
                    <Button onClick={ this.headerMenuHandler.bind(this) }>
                      <Icon icon="bars" />
                    </Button>
                  </section>
                </section>
              </section>
            </section>
            <section className="syn-top_bar-menu-row">
              { this.topStrip }
            </section>
          </div>
        </header>

        <Login show={ this.state.showLogin } join={ this.toggleJoin.bind(this) } forgot-password={ this.toggleForgotPassword.bind(this) } />
        <Join show={ this.state.showJoin } login={ this.toggleLogin.bind(this) } />
        <ForgotPassword show={ this.state.showForgotPassword } login={ this.toggleLogin.bind(this) } join={ this.toggleJoin.bind(this) } />
        <section id="syn-header-menu" ref="header-menu">
          <ul>
           { this.topBurger }
          </ul>
        </section>
      </section>
    );
  }
}

export default TopBar;
