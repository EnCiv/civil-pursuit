'use strict'

import fs                       from 'fs';
import http                     from 'http';
import { EventEmitter }         from 'events';

import express                  from 'express';
import bodyParser               from 'body-parser';
import cookieParser             from 'cookie-parser';
import passport                 from 'passport';

import printIt                  from './util/express-pretty';
import makePanelId              from '../lib/app/make-panel-id';
import makePanel                from '../lib/app/make-panel';

import TwitterPassport          from './routes/twitter';
import FacebookPassport         from './routes/facebook';
import signInRoute              from './routes/sign-in';
import signUpRoute              from './routes/sign-up';
import tempIdRoute              from './routes/temp-id';
import signOutRoute             from './routes/sign-out';
import setUserCookie            from './routes/set-user-cookie';
import turkUser                 from './routes/turk-user';
import serverReactRender        from './routes/server-react-render';


import User                     from '../models/user';
import Item                     from '../models/item';
import Type                     from '../models/type';

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

          this.passport();

          //this.twitterMiddleware();

          //this.facebookMiddleware();

          this.signers();

          this.cdn();

          this.router();

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

  getBrowserConfig(){
    this.app.use((req, res, next) => {
      var sniffr = new Sniffr();
      sniffr.sniff(req.headers['user-agent']);
      var device = Device(req.headers['user-agent']);
      this.browserConfig.os = sniffr.os;
      this.browserConfig.browser = sniffr.browser;
      this.browserConfig.type = device.type;
      this.browserConfig.model = device.model;
      this.browserConfig.referrer = req.headers['referrer']; //  Get referrer for referrer
      this.browserConfig.ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get IP - allow for proxy
      logger.info(req.method, req.originalUrl, {browserConfig: this.browserConfig});
      next();
    });
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

      this.app.all('/tempid',
      tempIdRoute,
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
    /*if ( process.env.NODE_ENV !== 'production' ) */this.timeout();
    this.getBrowserConfig();
    this.app.get('/robots.txt', (req, res) => { res.type('text/plain'); res.send("User-agent: *\nAllow: /"); });
    if ( process.env.NODE_ENV === 'production' ) this.httpToHttps();
    this.resetPassword(); // before /page/:page
    this.getLandingPage();
    this.getUIMPath();
    this.getOldfield();
    this.getSettings();
    this.getItemPage();
    this.getIPage();
    this.getPanelPage();
    this.getODG();
    this.getMarkDown();

    this.app.get('/page/:page', serverReactRender.bind(this));

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

  httpToHttps(){
    this.app.enable('trust proxy');
    this.app.use((req,res,next) => {
      let hostName=req.hostname;
      if(hostName==='localhost') return next();
      let hostParts=hostName.split('.');
      let addWWW=false;
      if((hostParts.length && hostParts[1]!=="herokuapp") && (!hostParts.length || hostParts[0]!=='www')){
        hostParts.unshift("www");
        hostName=hostParts.join('.');
        addWWW=true;
      }
      if(!req.secure || addWWW){
        console.info("server.httpToHttps redirecting to ", req.secure, 'https://' + req.hostname + req.url)
        res.redirect('https://' + hostName + req.url);
      } else
        next(); /* Continue to other routes if we're not redirecting */
    })
  }

  // a minute after a request has been received, check and see if the response has been sent.
  timeout () {
    this.app.use((req, res, next) => {
      setTimeout(() => {
         if ( ! res.headersSent ) {
          logger.error("timeout headersSent:", res.headersSent, "originalUrl", req.originalUrl, "ip", req.ip);
          next(new Error('Test error > timeout headers not sent'));
        }
      }, 1000 * 29);
      next();
    });
  }

 getOldfield(){ // hard coding a short route
  this.app.get('/Oldfield', (req, res, next) =>{
    res.redirect('/item/81GUO/Oldfield');
  }
  );
 }

  getLandingPage () {
    try {
      this.app.get('/',
        setUserCookie,
        serverReactRender.bind(this));
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

    getUIMPath () {
    try {
      this.app.get('/h/*',
        (req, res, next) => {
          logger.info("server.getUIMPath", req.path)
          next();
        },
        setUserCookie,
        serverReactRender.bind(this));
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
  
  getMarkDown () {
    this.app.get('/doc/:mddoc', (req, res, next) => {
      fs
        .createReadStream(req.params.mddoc)
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
    this.app.get('/item/*', (req, res, next) => {
      let segments=req.params[0].split('/');
      if(!segments || !segments.length || !segments[0].length) next();
      let userId= (req.cookies.synuser && req.cookies.synuser.id) ? req.cookies.synuser.id : null;
      let parts=segments[0].split(',');
      var shortId;
      parts.forEach(part=>{
        if(part.length===5) shortId=part;
      });
      if(!shortId) next();
      try {
        Item.findOne({ id : shortId }).then(
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
    }, setUserCookie,
    serverReactRender.bind(this));
  }

  getIPage () {
    this.app.get('/i/*',
    turkUser.bind(this),
    (req, res, next) => {
      let segments=req.params[0].toString().split('/');  // after using req.query in turkUser params in now an object rather than an array
      if(!segments || !segments.length || !segments[0].length) next();
      let userId= (req.cookies.synuser && req.cookies.synuser.id) ? req.cookies.synuser.id : null;
      let parts=segments[0].split(',');
      var shortId;
      parts.forEach(part=>{
        if(part.length===5) shortId=part;
      });
      if(!shortId) next();
      try {
        Item.findOne({ id : shortId }).then(
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
                    next();
                  }, next);
                } else {
                  req.panels[makePanelId(item)] = makePanel(item);

                  req.panels[makePanelId(item)].panel.items.push(item);
                   next();
                }
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
    }, setUserCookie,
    serverReactRender.bind(this));
  }
 
  getODG () {
    try {
      this.app.get('/odg',
        (req, res, next) => {
          var userId= (req.cookies.synuser && req.cookies.synuser.id) ? req.cookies.synuser.id : null;
          try {
            Type.findOne({ id : 'Polzc' }).then(
              type => {
                if ( ! type ) {
                  return next(new Error('No such type'));
                }

                logger.info({type: {name: type.name, _id: type._id}});

                Item.findOne({ id : 'bvuDs' }).then(
                  item => {
                    if ( ! item ) {
                      return next();
                    }

                    logger.info({item: {subject: item.subject, _id: item._id}});

                    const panelId = makePanelId({ type: type._id, parent : item._id });

                    const query = {
                      type: type._id,
                      parent: item._id,
                    };

                    logger.info({query}, {userId});
                    Item.getPanelItems(query, userId).then(
                      results => {
                        req.panels = { [panelId] : makePanel({ type: type, parent : item }) };
                        logger.info({count: results.count});

                        req.panels[panelId].panel.items=req.panels[panelId].panel.items.concat(results.items);

                        next();
                      }, 
                      next
                    );
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
        },
        setUserCookie,
        serverReactRender.bind(this));
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  getPanelPage () {
    this.app.get('/items/:panelShortId/:panelParent?', (req, res, next) => {
    var userId= (req.cookies.synuser && req.cookies.synuser.id) ? req.cookies.synuser.id : null;
      try {
        Type.findOne({ id : req.params.panelShortId }).then(
          type => {
            if ( ! type ) {
              return next(new Error('No such type'));
            }

            logger.info({type: {name: type.name, _id: type._id}});

            Item.findOne({ id : req.params.panelParent }).then(
              item => {
                if ( ! item ) {
                  return next();
                }

                logger.info({item: {subject: item.subject, _id: item._id}});

                const panelId = makePanelId({ type: type._id, parent : item._id });

                const query = {
                  type: type._id,
                  parent: item._id,
                };

                logger.info({query}, {userId});
                Item.getPanelItems(query, userId).then(
                  results => {
                    req.panels = { [panelId] : makePanel({ type: type, parent : item }) };
                    logger.info({count: results.count});

                     req.panels[panelId].panel.items=req.panels[panelId].panel.items.concat(results.items);

                    next();
                  }, 
                  next
                );
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
    },setUserCookie,
    serverReactRender.bind(this));
  }

  resetPassword(){
    this.app.get(['/page/reset-password/:token','/page/reset-password/:token/*'], (req, res, next) => {
      try{
        if(req.params.token){
          User.findOne({activation_token: req.params.token}).then(user=>{
              if(user && user._id){
                req.user=user.toJSON();
                req.cookies.synuser={id: req.user._id, email: req.user.email} // passing the activation key also
                req.activation_key=user.activation_key;
                setUserCookie(req,res,next);
              }else
                next();
            },
            (error)=>{console.info("resetPassord found error",error); next(error)}
          )
        }
      }
      catch(error){
        next(error);
      }
    },serverReactRender.bind(this))
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

  start () {
    this.server = http.createServer(this.app);
    this.server.timeout=3*60*1000;

    this.server.on('error', error => {
      this.emit('error', error);
    });

    this.server.listen(this.app.get('port'),  () => {
      logger.info('Server is listening', {
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
            logger.info('destroying socket', socketId);
            this.sockets[socketId].destroy();
          }
        },
        ko
      );
    });
  }

}

export default HttpServer;
