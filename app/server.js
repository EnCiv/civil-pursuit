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
import makePanelId              from './lib/app/make-panel-id';
import makePanel                from './lib/app/make-panel';

import TwitterPassport          from './routes/twitter';
import FacebookPassport         from './routes/facebook';
import signInRoute              from './routes/sign-in';
import signUpRoute              from './routes/sign-up';
import signOutRoute             from './routes/sign-out';
import setUserCookie            from './routes/set-user-cookie';
import serverReactRender         from './routes/server-react-render';
// import errorRoutes              from './routes/error';

import User                     from './models/user';
import Item                     from './models/item';
import Type                     from './models/type';

import API                      from './api';
import Sniffr                   from 'sniffr';
import Device                   from 'device';


class HttpServer extends EventEmitter {

  sockets = {};

  nextSocketId = 0;
  browserConfig = {};

  constructor (props) {
    super();

    this.props = props;

    this

      .on('message', (...messages) => {
        if ( this.props.verbose ) {
          console.log("server.constructor", ...messages);
        }
      })

      .on('request', printIt)

      .on('response', function (res) {
        printIt(res.req, res);
      });

      process.nextTick(() => {
        try {
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

          this.cdn();

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
    this.getQSortPage();

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
          var sniffr = new Sniffr();
          sniffr.sniff(req.headers['user-agent']);
          var device = Device(req.headers['user-agent']);
          this.browserConfig.os = sniffr.os;
          this.browserConfig.browser = sniffr.browser;
          this.browserConfig.type = device.type;
          this.browserConfig.model = device.model;
          this.browserConfig.referrer = req.headers['referrer']; //  Get referrer for referrer
          this.browserConfig.ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get IP - allow for proxy
          console.info("server.getLandingPage browser", this.browser);
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
        serverReactRender.bind(this));

      this.app.get('/page/:page', serverReactRender.bind(this));
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
      let userId= (req.cookies.synuser && req.cookies.synuser.id) ? req.cookies.synuser.id : null;
          var sniffr = new Sniffr();
          sniffr.sniff(req.headers['user-agent']);
          var device = Device(req.headers['user-agent']);
          this.browserConfig.os = sniffr.os;
          this.browserConfig.browser = sniffr.browser;
          this.browserConfig.type = device.type;
          this.browserConfig.model = device.model;
          this.browserConfig.referrer = req.headers['referrer']; //  Get referrer for referrer
          this.browserConfig.ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get IP - allow for proxy
          console.info("server.getItemPage browser", this.browser);
      try {
        Item.findOne({ id : req.params.item_short_id }).then(
          item => {
            if ( ! item ) {
              return next();
            }
            item.toPanelItem(userId).then(
              item => {
                req.panels = {};
                if(item & item.parent) {
                  item.getLineage(userId).then( lineage => {
                    lineage.forEach((ancestor, index) => {
                      const panelId = makePanelId(ancestor);

                      if ( ! req.panels[panelId] ) {
                        req.panels[panelId] = makePanel(ancestor);
                      }

                      req.panels[panelId].panel.items.push(ancestor);

                      req.panels[panelId].active = `${ancestor._id}-subtype`;
                    });

                  });
                }
                req.panels[makePanelId(item)] = makePanel(item);

                req.panels[makePanelId(item)].panel.items.push(item);

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
    }, serverReactRender.bind(this));
  }

  getQSortPage () {
    this.app.get('/qsort/:parent_short_id/:item_slug', (req, res, next) => {
      let userId= (req.cookies.synuser && req.cookies.synuser.id) ? req.cookies.synuser.id : null;
          var sniffr = new Sniffr();
          sniffr.sniff(req.headers['user-agent']);
          var device = Device(req.headers['user-agent']);
          this.browserConfig.os = sniffr.os;
          this.browserConfig.browser = sniffr.browser;
          this.browserConfig.type = device.type;
          this.browserConfig.model = device.model;
          this.browserConfig.referrer = req.headers['referrer']; //  Get referrer for referrer
          this.browserConfig.ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get IP - allow for proxy
          console.info("server.getItemPage browser", this.browser);
      try {
        Item.findOne({ id : req.params.parent_short_id }).then(
          item => {
            if ( ! item ) {
              return next();
            }
            item.toPanelItem(userId).then(
              item => {
                  const query = {
                  type: item.subType._id || item.subType.type,
                  parent: item._id,
                  size: 100
                };

 //               let qTopId=makePanelId(item);
                req.panels = {};

//                req.panels[qTopId] = makePanel(item);

//                req.panels[qTopId].panel.items.push(item);

                console.info("server getQsortPage got item", item );

                console.info("server getQsortPage got item", query );

                let qPanelId=makePanelId(query);

                console.info("server getQsortPage got panelId", qPanelId );

                req.panels[qPanelId] = makePanel(query);

                console.info("server getQsortPage made panel", req.panels[qPanelId] );

                Item
                  .getPanelItems(query, userId)
                  .then(
                      results => {
                          console.info("server getQsortPage got panel items", results.count );
                          req.panels[qPanelId].panel.items=results.items.slice(0);
                        }, this.error.bind(this)
                    );
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
    }, serverReactRender.bind(this));
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

                console.log("server.getPanelPage", require('util').inspect(req.panels, { depth: null }));

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
    }, serverReactRender.bind(this));
  }

  cdn () {
    this.app.use('/assets/',      express.static('assets'));
  }


  notFound () {
    this.app.use((req, res, next) => {
      res.statusCode = 404;
      req.notFound = true;
      next();
    }, serverReactRender.bind(this));
  }

  error () {
    this.app.use((error, req, res, next) => {
      // res.send('hello')
      this.emit('error', error);

      res.statusCode = 500

      res.locals.error = error;

      next();
    }, serverReactRender.bind(this));
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
        env     :   this.app.get('env'),
      });

      this.emit('listening', { port : this.app.get('port') });

      this.socketAPI = new API(this)
        .on('error', error => this.emit('error', error))
        .on('message', this.emit.bind(this, 'message'));
    });

    this.server.on('connection', socket => {
      // Add a newly connected socket
      const socketId = this.nextSocketId++;
      this.sockets[socketId] = socket;

      // Remove the socket when it closes
      socket.on('close', () => {
        delete this.sockets[socketId];
      });

      // Extend socket lifetime for demo purposes
      // socket.setTimeout(4000);
    });
  }

  stop () {
    return new Promise((ok, ko) => {
      this.socketAPI.disconnect().then(
        () => {
          this.server.close(ok);

          for (let socketId in this.sockets) {
            console.log('socket', socketId, 'destroyed');
            this.sockets[socketId].destroy();
          }
        },
        ko
      );
    });
  }

}

export default HttpServer;
