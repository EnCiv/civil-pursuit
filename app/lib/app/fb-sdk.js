'use strict';

import config from '../../../public.json';

class Facebook {

  appId       =   config.facebook[synappEnv]['app id'];
  cookie      =   true;
  xfbml       =   true;
  version     =   'v2.5';
  waitForFB;

  constructor () {
    this.waitForFB = window.setInterval(() => {
      console.log('FB', typeof FB !== 'undefined');

      if ( FB ) {
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
  }
}

export default Facebook;
