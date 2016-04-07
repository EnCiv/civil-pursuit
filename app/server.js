'use strict';

import path                     from 'path';

import _                        from 'lodash';
import express                  from 'express';
import session                  from 'express-session';
import bodyParser               from 'body-parser';
import cookieParser             from 'cookie-parser';
import passport                 from 'passport';
import Server                   from 'express-emitter'
import renderReact              from 'reacted-express';
import sequencer                from 'promise-sequencer';

import config                   from '../secret.json';

import printIt                  from './lib/util/express-pretty';
import getTime                  from './lib/util/print-time';
import makePanelId              from './lib/app/make-panel-id';
import makePanel                from './lib/app/make-panel';

import TwitterPassport          from './routes/twitter';
import signInRoute              from './routes/sign-in';
import signUpRoute              from './routes/sign-up';
import signOutRoute             from './routes/sign-out';
import setUserCookie            from './routes/set-user-cookie';
import homePage                 from './routes/home';

import User                     from './models/user';
import Type                     from './models/type';
import Item                     from './models/item';
import Discussion                     from './models/discussion';
import Training                     from './models/training';

import API                      from './api';

import type {isItem} from './interfaces/Item';
import type {isPanel} from './interfaces/Panel';
import type {isDiscussion} from './interfaces/Discussion';
import type {isTraining} from './interfaces/Training';

type initialData = {
  intro : ?isItem,
  panel : ?isPanel,
  discussion : ?isDiscussion,
  training : ?isTraining
};

class HttpServer extends Server {

  static fetchInitialData () {
    return new Promise((pass, fail) => {
      try {
        const stack = [
          Item.getIntro(),
          Item.getTopLevel(),
          Discussion.findCurrent(),
          Training.find()
        ];

        Promise.all(stack)
          .then(results => {
            const [ intro, panel, discussion, training ] = results;
            const response: initialData = { intro, panel, discussion, training };
            pass(response);
          })
          .catch(fail);
      }
      catch (error) {
        fail(error);
      }
    });
  }

  app;
  api;
  props = {};
  cache: initialData = {
    intro : null,
    panel : null,
    discussion : null,
    training : null
  };

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

    if ( ! props.initialData.intro ) {
      throw new Error('Missing intro');
    }

    this.cache = this.props.initialData;

    // Twitter

    new TwitterPassport(this.app);

    this.app

      // Identify user
      //------------------------------------------------------------------------

      .use((req, res, next) => {
        if ( req.cookies.synuser ) {
          User
            .findById(req.cookies.synuser.id)
            .then(user => {
              req.user = user;
              next();
            })
            .catch(next);
        }
        else {
          next()
        }
      })

      // Log in
      //------------------------------------------------------------------------

      .post('/sign/in',
        signInRoute,
        setUserCookie,
        (req, res) => {
          res.send({
            in: true,
            id: req.user._id
          });
        }
      )

      // Join
      //------------------------------------------------------------------------

      .post('/sign/up',
        signUpRoute,
        setUserCookie,
        (req, res) => {
          res.json({
            up: true,
            id: req.user._id
          });
        }
      )

      // Sign out
      //------------------------------------------------------------------------

      .all('/sign/out', signOutRoute)

      // User settings
      //------------------------------------------------------------------------

      .get('/settings', (req, res, next) => {
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
      })

      // Home
      //------------------------------------------------------------------------

      .get('/', this.render({ intro : true }))

      // Item page
      //------------------------------------------------------------------------

      .get(
        '/item/:itemId/:itemSlug',
        (req, res, next) => {
          sequencer.pipe(
            () => Item.findOne({ id: req.params.itemId }),

            item => item.toPanelItem(),

            item => new Promise((pass, fail) => {
              res.locals.item = item;
              pass(item);
            }),

            item => Item.getPanelItems(_.pick(item, ['type', 'parent']))
          )
          .then(panel => {
            res.locals.panel = panel;
            next();
          })
          .catch(next);
        },
        this.render({ intro : true, item : true })
      )

      // Static files
      //------------------------------------------------------------------------

      .use('/assets/', express.static('assets'))

      // Not found
      //------------------------------------------------------------------------

      .use(
        (req, res, next) => {
          res.statusCode = 404;
          next();
        },
        this.render({ intro : true })
      )

      // Server error
      //------------------------------------------------------------------------

      .use(
        (err, req, res, next) => {
          this.emit('error', err);

          res.statusCode = 500;

          res.locals.error = err;

          next();
        },
        this.render()
      );

    this

      .on('message', (...messages) => {
        if ( props.verbose ) {
          console.log(...messages);
        }
      })

      .on('request', printIt)

      .on('response', function (res) {
        printIt(res.req, res);
      })

      .on('listening', () => {
        this.api = new API(this.server);

        this.api

          .on('error', this.emit.bind(this, 'error'))

          .on('message', this.emit.bind(this, 'message'))

          .on('listening', this.emit.bind(this, 'message', 'Web Sockets up!'));
      });
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  render (options = {}) {
    return (req, res, next) => {
      let env = this.app.get('env');

      if ( env === 'test' ) {
        env = 'development';
      }

      const props = {
        meta : {
          path : req.path,
          synappEnv : process.env.SYNAPP_ENV,
          error : null,
          notFound : false
        },
        store : {
          user : req.user,
          ...this.cache
        }
      };

      if ( options.item ) {
        props.store.item = res.locals.item;
        props.store.panel = res.locals.panel;
      }

      const renderOptions = {
        inject    :   {
          into    :   `index.${env}.html`,
          where   :   'Loading',
          props   :   /\{ \/\* reactProps \*\/ \}/
        }
      };

      for ( const entry in require.cache ) {
        if ( path.dirname(entry) === path.join(__dirname, 'components') ) {
          delete require.cache[entry];
        }
      }

      const App = require('./components/app').default;

      renderReact(App, props, renderOptions)(req, res, next);
    };
  }
}

export default HttpServer;
