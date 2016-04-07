'use strict'

import fs                       from 'fs';
import http                     from 'http';
import { EventEmitter }         from 'events';

import express                  from 'express';
import session                  from 'express-session';
import bodyParser               from 'body-parser';
import cookieParser             from 'cookie-parser';
import passport                 from 'passport';
import Server                   from 'express-emitter'

import config                   from '../secret.json';

import printIt                  from './lib/util/express-pretty';
import getTime                  from './lib/util/print-time';
import makePanelId              from './lib/app/make-panel-id';
import makePanel                from './lib/app/make-panel';

import TwitterPassport          from './routes/twitter';
import FacebookPassport         from './routes/facebook';
import signInRoute              from './routes/sign-in';
import signUpRoute              from './routes/sign-up';
import signOutRoute             from './routes/sign-out';
import setUserCookie            from './routes/set-user-cookie';
import homePage                 from './routes/home';
// import errorRoutes              from './routes/error';

import User                     from './models/user';
import Item                     from './models/item';
import Type                     from './models/type';

import API                      from './api';


class HttpServer extends Server {

  constructor (props) {
    // Passport

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id).then(done, done);
    });

    super(app =>
      app

        // Port
        // _____________________________________________________________________

        .set('port', +(process.env.PORT || 3012))

        // Parsers
        // _____________________________________________________________________

        .use(
          bodyParser.urlencoded({ extended: true }),
          bodyParser.json(),
          bodyParser.text()
        )

        .use(cookieParser())

        // Session @deprecated?
        // _____________________________________________________________________

        .use(
          session({
            secret              :   config.secret,
            resave              :   true,
            saveUninitialized   :   true
          })
        )

        // Passport
        // _____________________________________________________________________

        .use(passport.initialize())
    );

    this.props = props;

    // Twitter

    new TwitterPassport(this.app);

    this.props = props;

    this.router();

    this.api();

    this.cdn();

    this.notFound();

    this.error();

    this

      .on('message', (...messages) => {
        if ( this.props.verbose ) {
          console.log(...messages);
        }
      })

      .on('request', printIt)

      .on('response', function (res) {
        printIt(res.req, res);
      })

      .on('listening', () => {
        new API(this)
          .on('error', this.emit.bind(this, 'error'));
      });
  }

  signers () {
    this.app.post('/sign/in',
      signInRoute,
      setUserCookie,
      function (req, res) {
        res.send({
          in: true,
          id: req.user._id
        });
      });

    this.app.all('/sign/up',
      signUpRoute,
      setUserCookie,
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
    this.getItemPage();
    this.getPanelPage();

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
        homePage.bind(this));

      this.app.get('/page/:page', homePage.bind(this));
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
    this.app.get('/item/:item_short_id/:item_slug', (req, res, next) => {
      try {
        Item.findOne({ id : req.params.item_short_id }).then(
          item => {
            if ( ! item ) {
              return next();
            }
            item.toPanelItem().then(
              item => {
                req.panels = {};

                item.lineage.forEach((ancestor, index) => {
                  const panelId = makePanelId(ancestor);

                  if ( ! req.panels[panelId] ) {
                    req.panels[panelId] = makePanel(ancestor);
                  }

                  req.panels[panelId].items.push(ancestor);

                  req.panels[panelId].active = `${ancestor._id}-subtype`;
                });

                req.panels[makePanelId(item)] = makePanel(item);

                req.panels[makePanelId(item)].items.push(item);

                next();
              },
              next
            );
          },
          next
        );
      }
      catch ( error ) {
        next(error);
      }
    }, homePage.bind(this));
  }

  getPanelPage () {
    this.app.get('/items/:panelShortId/:panelParent?', (req, res, next) => {
      try {
        Type.findOne({ id : req.params.panelShortId }).then(
          type => {
            if ( ! type ) {
              return next(new Error('No such type'));
            }

            const panelId = makePanelId({ type, parent : req.params.panelParent });

            Item.getPanelItems({ type, parent : req.params.panelParent }).then(
              results => {
                req.panels = { [panelId] : makePanel({ type, parent : req.params.panelParent }) };

                req.panels[panelId].items = results.items;

                console.log(require('util').inspect(req.panels, { depth: null }));

                next();

              },
              next
            );
          },
          next
        );
      }
      catch ( error ) {
        next(error);
      }
    }, homePage.bind(this));
  }

  cdn () {
    this.app.use('/assets/',      express.static('assets'));
  }

  notFound () {
    this.app.use((req, res, next) => {
      res.statusCode = 404;
      req.notFound = true;
      next();
    }, homePage.bind(this));
  }

  error () {
    this.app.use((error, req, res, next) => {
      // res.send('hello')
      this.emit('error', error);

      res.statusCode = 500

      res.locals.error = error;

      next();
    }, homePage.bind(this));
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
}

export default HttpServer;
