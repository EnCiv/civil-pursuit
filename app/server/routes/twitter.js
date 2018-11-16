'use strict';

import { format }         from 'util';
import passport           from 'passport';
import Passport           from '../../lib/app/Passport';
import PassportTwitter    from 'passport-twitter';
import config             from '../../../secret.json';

class Twitter extends Passport {

  constructor (app) {
    super('twitter', app);
  }

  strategy (req, res, next) {
    if ( ! this.app.locals.TwitterStrategy ) {
      this.app.locals.TwitterStrategy = PassportTwitter.Strategy;

      var callback;

      if ( req.hostname === 'localhost' ) {
        callback = format("http://%s:%d%s",
          req.hostname, this.app.get('port'), config.twitter[process.env.SYNAPP_ENV]['callback url']);
      }

      else {
        callback = format("http://%s%s",
          req.hostname, config.twitter[process.env.SYNAPP_ENV]['callback url'])
      }

      let _strategy = this.app.locals.TwitterStrategy;

      passport.use(
        new _strategy({
          consumerKey     :   config.twitter[process.env.SYNAPP_ENV]['key'],
          consumerSecret  :   config.twitter[process.env.SYNAPP_ENV]['secret'],
          callbackURL     :   callback
        },

        this.access.bind(this, req, res, next)
      ));
    }
  }

}

export default Twitter;
