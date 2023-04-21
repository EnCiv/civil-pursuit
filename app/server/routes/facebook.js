'use strict';

import util                   from 'util';
import passport               from 'passport';
import PassportFacebook       from 'passport-facebook';
import Passport               from '../../lib/app/Passport';

class Facebook extends Passport {

  constructor (app) {
    super('facebook', app);
  }

  strategy (req, res, next) {
    if ( ! this.app.locals.FacebookStrategy ) {
      this.app.locals.FacebookStrategy = PassportFacebook.Strategy;

      let callbackURL = this.CALLBACK_URL;

      if ( req.hostname === 'localhost' ) {
        callbackURL = util.format("http://%s:%d%s", req.hostname,
          this.app.get('port'), callbackURL);
      }

      else {
        callbackURL = util.format("http://%s%s", req.hostname, callbackURL)
      }

      let _strategy = this.app.locals.FacebookStrategy;

      console.log('passport', passport.use);

      console.log('strategy', _strategy);

      passport.use(
        new _strategy({
          clientID        :   process.env.FACEBOOK_ID,
          clientSecret    :   process.env.FACEBOOK_SECRET,
          callbackURL     :   callbackURL
        },

        this.access.bind(this, req, res, next)
      ));
    }
  }

}

export default Facebook;
