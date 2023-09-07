'use strict';

import Mungo from 'mungo';

const mongodbUrl = process.env.MONGODB_URI;

Mungo.connect(mongodbUrl)
  .on('connected', conn => {
    conn.db.admin().listDatabases()
      .then(dbs => {
        const promises = dbs.databases.map(db => new Promise((ok, ko) => {
          if ( /^syntest_\d/.test(db.name) ) {

            let url = mongodbUrl.split(/\//);

            url.pop();

            url = url.join('/') + '/' + db.name;

            Mungo.connect(url)
              .on('connected', conn => {
                // console.log(`dropping database ${db.name}`.yellow);
                conn.db.dropDatabase().then(ok, ko);
              })
              .on('error', error => console.log(error.stack));
          }
          else {
            return ok();
          }
        }));

        Promise.all(promises)
          .then(() => {
            console.log('ok!');
            process.exit(0);
          })
          .catch(error => console.log(error.stack));
      })
      .catch(error => console.log(error.stack));
  });
