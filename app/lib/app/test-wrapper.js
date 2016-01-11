'use strict';

import url                  from 'url';
import Mungo                from 'mungo';
import describe             from 'redtea';
import migrate              from 'syn/../../dist/bin/migrate';

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
