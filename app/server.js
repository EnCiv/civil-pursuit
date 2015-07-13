'use strict'

import path                     from 'path';
import fs                       from 'fs';
import http                     from 'http';
import { EventEmitter }         from 'events';
import express                  from 'express';
import session                  from 'express-session';
import bodyParser               from 'body-parser';
import cookieParser             from 'cookie-parser';
import passport                 from 'passport';
import printIt                  from './lib/util/express-pretty';
import TwitterPassport          from './routes/twitter';
import FacebookPassport         from './routes/facebook';
import initPipeLine             from './routes/init-pipeline';
import renderPage               from './routes/render-page';
import itemRoute                from './routes/item';
import signInRoute              from './routes/sign-in';
import signUpRoute              from './routes/sign-up';
import signOutRoute             from './routes/sign-out';
import User                     from './models/user';
import config                   from '../config.json';
import getTime                  from './lib/util/print-time';
import API                      from './api';

class HttpServer extends EventEmitter {

  constructor () {
    super();

    console.log('new server')

    this

      .on('message', function (message, info) {
        console.log(message, info);
      })

      .on('request', printIt)

      .on('response', function (res) {
        printIt(res.req, res);
      });

    this.app = express();

    this.set();

    this.parsers();

    this.cookies();

    this.session();

    this.passport();

    this.twitterMiddleware();

    this.facebookMiddleware();

    this.initPipeLine();

    this.signers();

    this.router();

    this.static();

    this.notFound();

    this.error();

    this.start();
  }

  set () {
    this.app.set('port', process.env.PORT || 3012);

    if (this.app.get('env') === 'development') {
      this.app.locals.pretty = true;
    }
  }

  passport () {
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id, done);
    });

    this.app.use(passport.initialize());
  }

  parsers () {
    this.app.use(
      bodyParser.urlencoded({ extended: true }),
      bodyParser.json(),
      bodyParser.text()
    );
  }

  cookies () {
    this.app.use(cookieParser());
  }

  session () {
    this.app.use(
      session({
        secret:             config.secret,
        resave:             true,
        saveUninitialized:  true
      })
    );
  }

  signers () {
    this.app.all('/sign/in',
      signInRoute,
      this.setUserCookie,
      function (req, res) {
        res.json({
          in: true,
          id: req.user._id
        });
      });

    this.app.all('/sign/up',
      signUpRoute,
      this.setUserCookie,
      function (req, res) {
        res.json({
          up: true,
          id: req.user._id
        });
      });

    this.app.all('/sign/out', signOutRoute);
  }

  setUserCookie (req, res, next) {
    res.cookie('synuser',
      { email: req.user.email, id: req.user._id },
      config.cookie
    );

    next();
  }

  facebookMiddleware () {
    new FacebookPassport(this.app);
  }

  twitterMiddleware () {
    new TwitterPassport(this.app);
  }

  initPipeLine () {
    this.app.use(initPipeLine.bind(this));
  }

  router () {
    this.getLandingPage();
    this.getTermsOfServicePage();
    this.getItemPage();
    this.getPage();

    this.app.get('/error', (req, res, next) => {
      next(new Error('Test error > next with error'));
    });

    this.app.get('/error/synchronous', (req, res, next) => {
      throw new Error('Test error > synchronous error');
    });

    this.app.get('/error/asynchronous', (req, res, next) => {
      process.nextTick(() => {
        throw new Error('Test error > asynchronous error');
      });
    });
  }

  getPage () {
    this.app.get('/page/:page', this.renderPage.bind(this));
  }

  getLandingPage () {
    this.app.get('/', this.renderPage.bind(this));
  }

  getTermsOfServicePage () {
    this.app.get('/page/terms-of-service', (req, res, next) => {
      req.page = 'terms of service';
      fs
        .createReadStream('TOS.md')
        .on('error', next)
        .on('data', function (data) {
          if ( ! this.data ) {
            this.data = '';
          }
          this.data += data.toString();
        })
        .on('end', function () {
          res.locals.TOS = this.data;
          next();
        });
    }, this.renderPage.bind(this));
  }
  

  getItemPage () {
    this.app.get('/item/:item_short_id/:item_slug',
      this.itemRoute.bind(this),
      this.renderPage.bind(this)
    );
  }

  static () {
    this.app.use('/assets/',      express.static('assets'));
    this.app.use('/css/',         express.static('dist/css'));
    this.app.use('/js/pages/',    express.static('dist/pages/'));
  }

  notFound () {
    this.app.use(
      function notFound (req, res, next) {
        res.status(404);
        req.page = 'not-found';
        next();
      },

      this.renderPage.bind(this));
  }

  error () {
    this.app.use((err, req, res, next) => {

      if ( ! err.stack ) {
        console.log('bug', err);
      }

      console.log('error', err.stack.split(/\n/));
      this.emit('error', err);

      res.locals.error = err.stack.split(/\n/);
      req.page = 'error';

      next();

    }, this.renderPage.bind(this));
  }

  start () {
    this.server = http.createServer(this.app);

    this.server.on('error', error => {
      this.emit('error', error);
    });

    this.server.listen(this.app.get('port'),  () => {
      this.emit('message', 'Server is listening', {
        port    :   this.app.get('port'),
        env     :   this.app.get('env')
      });

      this.emit('listening');
      
      new API(this)
        .on('error', error => this.emit('error', error));
    });
  }

}

HttpServer.prototype.renderPage = renderPage;
HttpServer.prototype.itemRoute = itemRoute;

export default HttpServer;
