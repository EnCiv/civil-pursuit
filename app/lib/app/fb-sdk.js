'use strict';

import { EventEmitter } from 'events';
import sequencer from 'promise-sequencer';
import superagent from 'superagent';

class Facebook extends EventEmitter {

  static connect (auto = true) {
    return new Promise((ok, ko) => {
      const _connect = () => {
        this.getUserInfo()
          .then(user => {
            console.info("fb-sdk",{ fbUser : user });
            this.logInApp(user)
              .then(() => {
                location.reload();
              })
              .catch(error => {
                if ( auto ) {
                  if ( error.message === 'Not Found' ) {
                    this.signInApp(user)
                      .then(user => {
                        location.reload();
                      })
                      .catch(ko);
                  }
                  else if ( error.message === 'Unauthorized' ) {
                    window.socket.emit('new facebook version', user, synUser => {
                      _connect();
                    });
                  }
                }
              })
          })
          .catch(ko);
      };

      this.getLoginStatus()
        .then(status => {
          console.info("fb-sdk", { status });
          switch ( status ) {
            case 'connected' :
              _connect();
              break;

            case 'not_authorized':
            default:
              if ( auto ) {
                this.logInFacebook()
                  .then(user => {
                    console.info("fb-sdk", { fbUser : user });
                    _connect();
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

  appId       =   process.env.FACEBOOK_APP_ID;
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
