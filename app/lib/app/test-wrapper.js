'use strict';

import url                  from 'url';
import Mungo                from 'mungo';
import describe             from 'redtea';
import socketClient         from 'socket.io-client';
import migrate              from '../../bin/migrate';
import Type                 from '../../models/type';
import Item                 from '../../models/item';
import Server               from '../../server/server';
import User                 from '../../models/user';
import Socket               from '../../lib/app/socket-mockup';
import WebDriver            from '../../lib/app/webdriver';

function testWrapper (name, options = {}, test) {
  const wrappers = {};

  return describe(name, it => {
    const locals = {};

    const before = [];

    const after = [];

    //  ************************************************************************
    //  MONGODB
    //  ************************************************************************


    if ( 'mongodb' in options ) {
      before.push(it => {
        const dbURL = process.env.MONGODB_URI;

        const parsed = url.parse(dbURL);

        const random = process.pid.toString() + Date.now().toString() + (Math.ceil(Math.random() * 997)).toString();

        parsed.pathname = `/syntest_${random}`;

        const mongoUrl = url.format(parsed);

        it(`should connect to MongoDB at ${mongoUrl}`,
          () => new Promise((ok, ko) => {
            Mungo.connect(mongoUrl)
              .on('error', ko)
              .on('connected', conn => {
                locals.conn = conn;
                ok();
              });
          })
        );

        if ( ! ( typeof options.mongodb === 'object' && ! options.mongodb.migrate) ) {
          it('should migrate', () => migrate());
        }
      });

      after.push(it => {
        it('should remove sandbox database',
          () => locals.conn.db.dropDatabase()
        );

        it('should disconnect from MongoDB',
          () => locals.conn.disconnect()
        );

      });
    }

    //  ************************************************************************
    //  HTTP
    //  ************************************************************************

    if ( 'http' in options ) {
      before.push(it => {
        it('should start http', it => {
          it('should get intro type',
            () => Type
              .findOne({ name : 'Intro' })
              .then(type => { locals.introType = type })
          );

          it('should get intro item',
            () => Item
              .findOne({ type : locals.introType })
              .then(item => { locals.introItem = item })
          );

          it('should panelify intro item',
            () => locals.introItem
              .toPanelItem()
              .then(item => { locals.introItem = item })
          );

          it('should start server',
            () => new Promise((ok, ko) => {
              locals.http = new Server({ intro : locals.introItem });

              process.env.PORT = 13012;

              locals.http
                .on('error', error => {
                  console.log('Server error'.bgRed.bold.yellow);
                  if ( error.stack ) {
                    console.log(error.stack.yellow);
                  }
                  else {
                    console.log('Error has no stack!'.red.bold);
                    console.log(error);
                  }
                  ko(error);
                })
                .on('listening', status => {
                  console.log('HTTP server listening'.green, status);
                  ok();
                });

              if ( typeof options.http === 'object' && options.http.verbose ) {
                locals.http
                  .on('message', console.log.bind(console, 'server message'));
              }
            })
          );
        });
      });

      after.push(it => {
        it('should stop server', () => locals.http.stop());
      });
    }

    //  ************************************************************************
    //  SOCKETS
    //  ************************************************************************

    if ( 'sockets' in options ) {
      locals.sockets = {};

      before.push(it => {

        it('should create mocker', () => {
          locals.sockets.apiClient = Socket({
            port : locals.http.app.get('port')
          })
        });

        it('it should connect', () => new Promise((ok, ko) => {

          try {
            locals.sockets.client = socketClient.connect(`http://localhost:${locals.http.app.get('port')}`, {
              transports: ['websocket'],
              'force new connection': true
            });

            locals.sockets.client
              .on('error', ko)
              .on('connect', ok);
          }
          catch ( error ) {
            ko(error);
          }

        }));

        it('should set synuser', () => new Promise((ok, ko) => {
          User
            .findOne()
            .then(
              user => {
                try {
                  const json = user.toJSON();
                  locals.sockets.apiClient.synuser = {
                    id : json._id
                  };
                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
        }));
      });
    }

    //  ************************************************************************
    //  DRIVER
    //  ************************************************************************

    if ( 'driver' in options ) {
      before.push(it => {
        it('should start driver', () => new Promise((ok, ko) => {
          locals.driver = new WebDriver();

          locals.driver
            .on('error', ko)
            .on('ready', ok);
        }));
      });

      after.push(it=> {
        it('should stop driver', () => locals.driver.quit());
      });
    }

    it('Wrappers', it => {
      before.forEach(fn => fn(it))
    });

    it(name, it => {
      try {
        test(locals)(it);
      }
      catch ( error ) {
        it('should not have error', () => { throw error });
      }
    });

    it('Wrappers', it => {
      after.forEach(fn => fn(it))
    });
  });
}

export default testWrapper;
