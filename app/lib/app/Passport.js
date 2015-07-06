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
    this.app = app;
    this.user = null;

    this.CALLBACK_URL = config[service][process.env.SYNAPP_ENV]['callback url'];
    this.SIGNIN_ROUTE = config.public.routes['sign in with ' + service];
    this.OK_ROUTE = config.public.routes['sign in with ' + service + ' OK']; 

    let d = new Domain().on('error', error => this.app.emit('error', error));

    d.run(() => {
      this.app.get(this.SIGNIN_ROUTE,
        this.serviceStrategy.bind(this),
        passport.authenticate(service));

      this.app.get(this.CALLBACK_URL,
        this.callback.bind(this));

      this.app.get(this.OK_ROUTE,
        this.ok.bind(this));
    });
  }

  associate (req, res, next, user, done) {
    let d = new Domain().on('error', error => this.app.emit('error', error));

    d.run(() => {
      if ( user ) {
        this.user = user;
        done(null, user);
      }

      else {
        this.createUser(req, res, next, done);
      }
    });
  }

  access (req, res, next, accessToken, refreshToken, profile, done) {
    let d = new Domain().on('error', error => this.app.emit('error', error));

    d.run(() => {
      this.profile = profile;
      this.email = this.profile.id + '@facebook.com';
      UserModel.findOne({ email: email }, this.associate.bind(this, req, res, next));
    });
  }

  createUser (req, res, next, done) {
    let d = new Domain().on('error', error => this.app.emit('error', error));

    d.run(() => {
      UserModel.create(
        { email: this.email, password: this.profile.id + Date.now() },
        d.bind((error, user) => {
          if ( error ) {
            if ( error.message && /duplicate/.test(error.message) ) {
              return done(new Error('Duplicate user'));
            }
            
            return next(error);
          }

          this.user = user;
          
          done(null, user);
        })
      );


    });
  }

  serviceStrategy (req, res, next) {
    let d = new Domain().on('error', error => this.app.emit('error', error));

    d.run(() => {
      this.strategy(req, res, next);
      next();
    });
  }

  redirect (req, res, next, error, user, info) {
    if ( error ) {
      return next(error);
    }
    res.redirect(this.OK_ROUTE);
  }

  callback (req, res, next) {
    passport.authenticate('facebook', this.redirect.bind(this, req, res, next))
      (req, res, next);
  }

  ok () {
    res.cookie('synuser', {
        email   : this.user.email,
        id      : this.user.id
      }, config.cookie);

    res.redirect('/');
  }
}

export default Passport;
