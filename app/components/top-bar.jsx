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
import selectors                      from '../../selectors.json';
import menus                          from '../../fixtures/header-menu/1.json';
import LogupBar                          from './logup-bar';

class TopBar extends React.Component {
  topStrip=[];
  topBurger=[];

  renderMenuItem(name, onClick, href){
      // on desktop the menu is a strip across the top
      this.topStrip.push(
      <div className="syn-top_bar-menu-item" key={name}>
        <button onClick={onClick} >
          <a href={href}>{name}</a>
        </button>
      </div>
      );
      // on smartphone the menu is a hamber in the upper right corner
      this.topBurger.push(
        <li key={name}>
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
    document.querySelector('.syn-join').classList.remove('syn--visible');
    document.querySelector('.syn-login').classList.toggle('syn--visible');
    document.querySelector('.syn-forgot-password').classList.remove('syn--visible');
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
  // when the burger is pressed, the menu slides in from the right.
  // if you press the burger again the menu slides out to the right.
  // if you don't select a menu item, or press the burger in 15 seconds, the menu slides out to the right 

  headerMenuTimeout=null;
  headerWidth=0;

  headerMenuHandler (e) {
    e.preventDefault();
    const headerMenu = this.refs.hamburgermenu;
    const hamburger = this.refs.hamburger;
  
    function off () {
        headerMenu.style.right= (-Math.ceil(this.headerWidth))+'px';
        setTimeout(()=>{headerMenu.classList.remove('visible');  hamburger.classList.remove('on')}, 250); // 250 should be the same as the transition time in top-bar.less
    }

    function slideIn (){
      setTimeout(()=>headerMenu.style.right= 0 + 'px'); // in the next tick change right so that the motion occurs after the previous style change
      this.headerMenuTimeout=setTimeout(off.bind(this), 15000);
    }

    // first time through move the burger Menu below the burger
    // calculate the width, and move it right of the screen
    if(!this.headerWidth) {
      headerMenu.style.top=hamburger.getBoundingClientRect().bottom + 'px';
      hamburger.classList.add('on');
      headerMenu.classList.add('visible');
      this.headerWidth=headerMenu.offsetWidth; // get the width
      headerMenu.style.right= (-Math.ceil(this.headerWidth))+'px';
      setTimeout(()=>{ // on the next tick add in the transition so it doesn't slow the right change above
          headerMenu.classList.add('transitions');
          slideIn.call(this); 
      });
    } else {
      hamburger.classList.toggle('on');

      if ( headerMenu.classList.contains('visible') ) {
        if(this.headerMenuTimeout)clearTimeout(this.headerMenuTimeout);
        off.call(this);
      }else{
        headerMenu.classList.add('visible');
        slideIn.call(this); // let visible take effect before sliding in
      }
    }
  }

  getBannerNode(){
    return this.refs.banner;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, ready } = this.props;
    const {children, ...lessProps}=this.props;

    let comp = 'syn-top_bar';

    let onlineNow = this.props.online || 0;
    
    if(!this.topStrip.length){
    // render menus if not already rendered
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
    }

    
    return (
      <section>
        <header role="banner" className="syn-top_bar-wrapper" ref="banner">
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
                  <section className={ 'top_bar-hamburger'} ref="hamburger">
                    <Button onClick={ this.headerMenuHandler.bind(this) }>
                      <Icon icon="bars" />
                    </Button>
                  </section>
                  <section className="top_bar-hamburger-menu" ref="hamburgermenu">
                    <ul>
                      { this.topBurger }
                    </ul>
                  </section>
                </section>
              </section>
            </section>
            <section className="syn-top_bar-menu-row">
              { this.topStrip }
            </section>
            <LogupBar {...lessProps} />
          </div>
        </header>

        <Login show={ this.state.showLogin } join={ this.toggleJoin.bind(this) } forgot-password={ this.toggleForgotPassword.bind(this) } />
        <Join show={ this.state.showJoin } login={ this.toggleLogin.bind(this) } />
        <ForgotPassword show={ this.state.showForgotPassword } login={ this.toggleLogin.bind(this) } join={ this.toggleJoin.bind(this) } />
      </section>
    );
  }
}

export default TopBar;
