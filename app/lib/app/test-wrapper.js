'use strict';

import url                  from 'url';
import Mungo                from 'mungo';
import describe             from 'redtea';
import migrate              from 'syn/../../dist/bin/migrate';
import Type                 from 'syn/../../dist/models/type';
import Item                 from 'syn/../../dist/models/item';
import Server               from 'syn/../../dist/server';
import socketClient         from 'socket.io-client';
import User                 from 'syn/../../dist/models/user';
import Socket               from 'syn/../../dist/lib/app/socket-mockup';
import WebDriver            from 'syn/../../dist/lib/app/webdriver';

Mungo.verbosity = 0;

function testWrapper (name, options = {}, test) {
  const wrappers = {};

  return describe(name, it => {
    const locals = {};

    const before = [];

    const after = [];

    if ( 'mongodb' in options ) {
      before.push(it => {
        const dbURL = process.env.MONGOHQ_URL;

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
                  console.log(error);
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
        it('???', () => {});
        it('should stop server', () => locals.http.stop());
      });
    }

    if ( 'sockets' in options ) {
      before.push(it => {

        it('should create mocker', () => {
          locals.apiClient = Socket({
            port : locals.http.app.get('port')
          })
        });

        it('it should connect', () => new Promise((ok, ko) => {

          try {
            locals.socketClient = socketClient.connect(`http://localhost:${locals.http.app.get('port')}`, {
              transports: ['websocket'],
              'force new connection': true
            });

            locals.socketClient
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
                  locals.apiClient.synuser = {
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
        it('???', () => {});
        it('should stop driver', () => locals.driver.quit());
      });
    }

    it('Wrappers', it => {
      before.forEach(fn => fn(it))
    });

    it(name, it => {
      test(locals)(it);
    });

    it('Wrappers', it => {
      after.forEach(fn => fn(it))
    });
  });
}

export default testWrapper;
