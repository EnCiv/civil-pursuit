'use strict';

/** Passport Helper
 *
 *  @class              Passport
 *  @description        Helper for 3rd party signon with passport
*/

import {Domain}         from 'domain';
import util             from 'util';

import passport         from 'passport';

import config           from '../../../config.json';
import UserModel        from '../../models/user';

class Passport {

  constructor (service, app) {
    try {
      this.app = app;
      this.user = null;
      this.service = service;

      let { routes } = config.public;

      let env = process.env.SYNAPP_ENV;

      this.CALLBACK_URL   =   config[service][env]['callback url'];
      this.SIGNIN_ROUTE   =   routes['sign in with ' + service];
      this.OK_ROUTE       =   routes['sign in with ' + service + ' OK'];

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
        done(null, user);
      }

      else {
        this.createUser(req, res, next, done);
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
        .exec()
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
    try {
      let d = new Domain().on('error', next);

      d.run(() => {
        UserModel.create(
          { email: this.email, password: this.profile.id + Date.now() },
          d.bind((error, user) => {
            try {
              if ( error ) {
                if ( error.message && /duplicate/.test(error.message) ) {
                  return done(new Error('Duplicate user'));
                }

                return next(error);
              }

              this.user = user;

              done(null, user);
            }
            catch ( error ) {
              next(error);
            }
          })
        );
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
        id      : this.user.id
      }, config.cookie);

    res.redirect('/');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Passport;
