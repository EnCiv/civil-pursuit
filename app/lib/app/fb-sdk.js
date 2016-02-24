'use strict';

import { EventEmitter } from 'events';
import sequencer from 'promise-sequencer';
import superagent from 'superagent';
import config from '../../../public.json';

class Facebook extends EventEmitter {

  static connect (auto = true) {
    console.info('connecting via facebook', { auto });
    return new Promise((ok, ko) => {
      this.getLoginStatus()
        .then(status => {
          console.info({ status });
          switch ( status ) {
            case 'connected' :
              this.getUserInfo()
                .then(user => {
                  console.info({ fbUser : user });
                  this.logInApp(user)
                    .then(() => {
                      location.reload();
                    })
                    .catch(ko)
                })
                .catch(ko);

              break;

            case 'not_authorized':
            default:
              if ( auto ) {
                this.logInFacebook()
                  .then(user => {
                    console.info({ fbUser : user });
                    this.getUserInfo()
                      .then(user => {
                        console.info({ fbUser : user });
                        this.logInApp(user)
                          .then(() => {
                            location.reload();
                          })
                          .catch(ko)
                      })
                      .catch(ko);
                  })
                  .catch(ko);
              }
              break;
          }
        })
        .catch(ko);
    });
  }

  static getLoginStatus () {
    return new Promise((ok, ko) => {
      FB.getLoginStatus(res => {
        if ( res.error ) {
          return ko(new Error(res.error));
        }
        ok(res.status);
      });
    });
  }

  static getUserInfo(user = 'me') {
    return new Promise((ok, ko) => {
      FB.api(`/${user}?fields=id,email,name`, res => {
        if ( res.error ) {
          return ko(new Error(res.error));
        }
        ok(res);
      });
    });
  }

  static signInApp (user) {
    return new Promise((ok, ko) => {
      superagent
        .post('/sign/up')
        .send({ email : user.email, facebook : user.id })
        .end((err, res) => {
          if ( err ) {
            return ko(err);
          }
          ok();
        });
    });
  }

  static logInApp (user) {
    return new Promise((ok, ko) => {
      superagent
        .post('/sign/in')
        .send({ email : user.email, facebook : user.id })
        .end((err, res) => {
          if ( err ) {
            return ko(err);
          }
          ok();
        });
    });
  }

  static logInFacebook () {
    return new Promise((ok, ko) => {
      FB.login(
        response => {
          if ( response.error ) {
            return ko(new Error(response.error));
          }
          ok(response);
        },
        { scope: 'public_profile,email' }
      );
    });
  }

  // static login () {
  //   FB.getLoginStatus(this.statusChangeCallback.bind(this), true);
  // }
  //
  // static loginDialog () {
  //   FB.login(
  //     response => {
  //       console.log({response});
  //       this.login();
  //     },
  //     { scope: 'public_profile,email' }
  //   );
  // }
  //
  // static getLoginStatus (cb) {
  //   FB.getLoginStatus(cb, true);
  // }
  //
  // // This is called with the results from from FB.getLoginStatus().
  // static statusChangeCallback (response) {
  //   console.log('statusChangeCallback');
  //   console.log(response);
  //   // The response object is returned with a status field that lets the
  //   // app know the current login status of the person.
  //   // Full docs on the response object can be found in the documentation
  //   // for FB.getLoginStatus().
  //   if (response.status === 'connected') {
  //     // Logged into your app and Facebook.
  //     this.me(user => window.socket.emit('get facebook user', user));
  //   } else if (response.status === 'not_authorized') {
  //     // The person is logged into Facebook, but not your app.
  //     this.loginDialog();
  //   } else {
  //     // The person is not logged into Facebook, so we're not sure if
  //     // they are logged into this app or not.
  //     this.loginDialog();
  //   }
  // }
  //
  // static me(cb) {
  //   FB.api('/me?fields=id,email,name', cb);
  // }
  //
  // static testAPI() {
  //   console.log('Welcome!  Fetching your information.... ');
  //   FB.api('/me?fields=id,email,name', function(response) {
  //     console.log('Successful login for: ', response);
  //   });
  // }

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
