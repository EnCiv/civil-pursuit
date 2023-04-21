'use strict';

/** Passport Helper
 *
 *  @class              Passport
 *  @description        Helper for 3rd party signon with passport
*/

import {Domain}         from 'domain';

import passport         from 'passport';

import UserModel        from '../../models/user';
import DiscussionModel  from '../../models/discussion';
import Config from '../../../public.json'

class Passport {

  constructor (service, app) {
    try {
      this.app = app;
      this.user = null;
      this.service = service;

      let env = process.env.SYNAPP_ENV;

      this.CALLBACK_URL   =   `/sign/${service}/oauth`
      this.SIGNIN_ROUTE   =   `/sign/in/${service}`;
      this.OK_ROUTE       =   `/sign/in/${service}/ok`;

      this.app.get(this.SIGNIN_ROUTE,
        this.serviceStrategy.bind(this),
        passport.authenticate(service));

      this.app.get(this.CALLBACK_URL,
        this.callback.bind(this));

      this.app.get(this.OK_ROUTE,
        this.ok.bind(this));
    }
    catch ( error ) {
      this.app.emit('error', error);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  associate (req, res, next, user, done) {
    try {
      if ( user ) {
        this.user = user;

        done(null, user)
      }

      else {
        UserModel.create({
          email: this.email,
          password: this.profile.id + Date.now()
        })
        .then(user => {
          this.user = user;
          done(null, user);
        })
        .catch(next);
      }
    }
    catch ( error ) {
      this.app.emit('error', error);
      next(error);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  access (req, res, next, accessToken, refreshToken, profile, done) {
    try {
      this.profile  =   profile;
      this.email    =   `${this.profile.id}@${this.service}.com`;

      UserModel
        .findOne({ email: this.email })
        .then(
          user => { this.associate(req, res, next, user, done) },
          next
        );
    }
    catch ( error ) {
      next(error);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  createUser (req, res, next, done) {
    UserModel.create({
      email: this.email,
      password: this.profile.id + Date.now()
    })

    try {
      let d = new Domain().on('error', next);

      d.run(() => {
        UserModel
          .create({
            email: this.email,
            password: this.profile.id + Date.now()
          })
          .then(user => {
            try {
              this.user = user;

              DiscussionModel
                .findOne()
                .exec()
                .then(
                  discussion => {
                    try {
                      discussion.registered.push(user._id);
                      discussion.save(error => {
                        if ( error ) {
                          next(error);
                        }
                        done(null, user);
                      });
                    }
                    catch ( error ) {
                      next(error);
                    }
                  },
                  next
                );
            }
            catch ( error ) {
              next(error);
            }
          })
          .catch(error => {
            if ( error.message && /duplicate/.test(error.message) ) {
              return done(new Error('Duplicate user'));
            }

            return next(error);
          });
      });
    }
    catch ( error ) {
      next(error);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  serviceStrategy (req, res, next) {
    try {
      this.strategy(req, res, next);

      next();
    }
    catch ( error ) {
      next(error);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  redirect (req, res, next, error, user, info) {
    if ( error ) {
      return next(error);
    }
    res.redirect(this.OK_ROUTE);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  callback (req, res, next) {
    passport.authenticate(this.service, this.redirect.bind(this, req, res, next))
      (req, res, next);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  ok (req, res, next) {
    res.cookie('synuser', {
        email   : this.user.email,
        id      : this.user._id
      }, Config.cookie);

    res.redirect('/page/profile');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Passport;
