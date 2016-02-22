'use strict';

import { EventEmitter } from 'events';
import config from '../../../public.json';

class Facebook extends EventEmitter {

  static login () {
    FB.getLoginStatus(this.statusChangeCallback.bind(this), true);
  }

  static loginDialog () {
    FB.login(
      response => this.login(),
      { scope: 'public_profile,email' }
    );
  }

  static getLoginStatus (cb) {
    FB.getLoginStatus(cb, true);
  }

  // This is called with the results from from FB.getLoginStatus().
  static statusChangeCallback (response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      console.log('Please login to app');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      this.loginDialog();
    }
  }

  static me(cb) {
    FB.api('/me', cb);
  }

  static testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

  appId       =   /*config.facebook[synappEnv]['app id']*/'473111569540341';
  cookie      =   true;
  xfbml       =   true;
  version     =   'v2.5';
  waitForFB;

  constructor () {
    super();

    this.waitForFB = window.setInterval(() => {
      console.log('FB', typeof FB !== 'undefined');

      if ( typeof FB !== 'undefined' ) {
        window.clearInterval(this.waitForFB);
        this.init();
      }

    }, 1000);

    this.loadSDK();
  }

  src (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }

  loadSDK () {
    this.src(document, 'script', 'facebook-jssdk');
  }

  init () {
    FB.init({
      appId      :  this.appId,
      cookie     :  this.cookie,
      xfbml      :  this.xfbml,
      version    :  this.version
    });
    this.emit('ready');
  }
}

export default Facebook;
