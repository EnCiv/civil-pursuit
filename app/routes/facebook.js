'use strict';

import passport from 'passport';
import config from 'syn/config.json';
import User from 'syn/models/User';
import {Domain} from 'domain';
import {FacebookStrategy} from 'passport-facebook';
import util from 'util';
import Passport from 'syn/lib/app/Passport';

class Facebook extends Passport {

  constructor (app) {
    super('facebook', app);
  }

  strategy (req, res, next) {
    if ( ! this.app.locals.FacebookStrategy ) {
      this.app.locals.FacebookStrategy = FacebookStrategy;

      let callbackURL = this.CALLBACK_URL;

      if ( req.hostname === 'localhost' ) {
        callbackURL = util.format("http://%s:%d%s", req.hostname, app.get('port'), callbackURL);
      }

      else {
        callbackURL = util.format("http://%s%s", req.hostname, callbackURL)
      }

      let _strategy = app.locals.FacebookStrategy;

      passport.use(
        new _strategy({
          clientID:       config.facebook['app id'],
          clientSecret:   config.facebook['app secret'],
          callbackURL:    callbackURL
        },
        
        this.access.bind(this, req, res, next)
      ));
    }
  }

}

export default Facebook;
