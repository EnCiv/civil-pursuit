'use strict';

import { format }         from 'util';
import passport           from 'passport';
import Passport           from '../../lib/app/Passport';
import PassportTwitter    from 'passport-twitter';

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
          req.hostname, this.app.get('port'), '/sign/twitter/oauth');
      }

      else {
        callback = format("http://%s%s",
          req.hostname, '/sign/twitter/oauth')
      }

      let _strategy = this.app.locals.TwitterStrategy;

      passport.use(
        new _strategy({
          consumerKey     :   process.env.TWITTER_KEY,
          consumerSecret  :   process.env.TWITTER_SECRET,
          callbackURL     :   callback
        },

        this.access.bind(this, req, res, next)
      ));
    }
  }

}

export default Twitter;
