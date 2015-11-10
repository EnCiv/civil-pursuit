'use strict'

import fs                       from 'fs';
import http                     from 'http';
import { EventEmitter }         from 'events';
import express                  from 'express';
import session                  from 'express-session';
import bodyParser               from 'body-parser';
import cookieParser             from 'cookie-parser';
import passport                 from 'passport';
import config                   from '../secret.json';
import printIt                  from './lib/util/express-pretty';
import getTime                  from './lib/util/print-time';
import TwitterPassport          from './routes/twitter';
import FacebookPassport         from './routes/facebook';
import renderPage               from './routes/render-page';
import itemRoute                from './routes/item';
import signUpRoute              from './routes/sign-up';
import signOutRoute             from './routes/sign-out';
import * as Routes              from './routes';
import User                     from './models/user';
import Item                     from './models/item';
import DiscussionModel          from './models/discussion';
import API                      from './api';

class HttpServer extends EventEmitter {

  constructor (props) {
    super();

    this.props = props;

    this

      .on('message', (...messages) => {
        if ( this.props.verbose ) {
          console.log(...messages);
        }
      })

      .on('request', printIt)

      .on('response', function (res) {
        printIt(res.req, res);
      });

      process.nextTick(() => {
        try {
          if ( ! this.props.intro ) {
            throw new Error('Missing intro');
          }

          this.app = express();

          this.set();

          this.parsers();

          this.cookies();

          this.session();

          this.passport();

          this.twitterMiddleware();

          this.facebookMiddleware();

          this.signers();

          this.router();

          this.api();

          this.static();

          this.notFound();

          this.error();

          this.start();
        }
        catch ( error ) {
          this.emit('error', error);
        }
      });

  }

  set () {
    this.app.set('port', +(process.env.PORT || 3012));
  }

  passport () {
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id).then(done, done);
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
    this.app.post('/sign/in',
      Routes.signIn,
      Routes.setUserCookie,
      function (req, res) {
        console.log(req.user);
        res.send({
          in: true,
          id: req.user._id
        });
      });

    this.app.all('/sign/up',
      signUpRoute,
      Routes.setUserCookie,
      function (req, res) {
        res.json({
          up: true,
          id: req.user._id
        });
      });

    this.app.all('/sign/out', signOutRoute);
  }

  facebookMiddleware () {
    new FacebookPassport(this.app);
  }

  twitterMiddleware () {
    new TwitterPassport(this.app);
  }

  router () {
    this.timeout();
    this.getLandingPage();
    this.getTermsOfServicePage();
    this.getSettings();
    // this.getPage();

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

  timeout () {
    this.app.use((req, res, next) => {
      setTimeout(() => {
        if ( ! res.headersSent ) {
          next(new Error('Test error > timeout'));
        }
      }, 1000 * 60);
      next();
    });
  }

  getLandingPage () {
    try {
      this.app.get('/',
        (req, res, next) => {
          if ( ! req.cookies.synapp ) {
            res.cookie('synapp',
              { training : true },
              {
                "path":"/",
                "signed": false,
                "maxAge": 604800000,
                "httpOnly": true
              });
          }
          // else {

          // }
          next();
        },
        Routes.homePage.bind(this));

      this.app.get('/page/:page', Routes.homePage.bind(this));
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  getSettings () {
    try {
      this.app.get('/settings', (req, res, next) => {
        try {
          if ( 'showtraining' in req.query ) {
            res.cookie('synapp',
              { training : !!+(req.query.showtraining) },
              {
                "path":"/",
                "signed": false,
                "maxAge": 604800000,
                "httpOnly": true
              });
            res.send({ training : !!+(req.query.showtraining) });
          }
        }
        catch ( error ) {
          next(error);
        }
      });
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  getTermsOfServicePage () {
    this.app.get('/doc/terms-of-service.md', (req, res, next) => {
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
          res.header({ 'Content-Type': 'text/markdown; charset=UTF-8'});
          res.send(this.data);
        });
    });
  }

  getItemPage () {
    this.app.get('/item/:item_short_id/:item_slug',
      this.itemRoute.bind(this),
      this.renderPage.bind(this)
    );
  }

  static () {
    this.app.use('/assets/',      express.static('assets'));
  }

  notFound () {
    this.app.use((req, res, next) => res.send('Page not found'));
  }

  error () {
    this.app.use((err, req, res, next) => {

      this.emit('error', err);
      res.send(err);

    });
  }

  api () {
    this.app.all('/api/:handler', (req, res, next) => {
      let apiHandler;

      for ( let handler in this.socketAPI.handlers ) {
        if ( this.socketAPI.handlers[handler].slugName === req.params.handler ) {
          apiHandler = {
            name : handler,
            method : this.socketAPI.handlers[handler]
          };
        }
      }

      if ( ! apiHandler ) {
        return next();
      }


    });
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

      this.emit('listening', { port : this.app.get('port') });

      this.socketAPI = new API(this)
        .on('error', error => this.emit('error', error))
        .on('message', this.emit.bind(this, 'message'));
    });
  }

}

HttpServer.prototype.renderPage = renderPage;
HttpServer.prototype.itemRoute = itemRoute;

export default HttpServer;
