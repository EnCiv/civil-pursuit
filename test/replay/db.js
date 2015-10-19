'use strict';

import should               from 'should';
import mongodb              from 'mongodb';
import url                  from 'url';
import sequencer            from '../../app/lib/util/sequencer';
import Mung                 from '../../app/lib/mung';
import User                 from '../../app/models/user';
import migrate              from '../../app/bin/migrate';

let dbURL = process.env.MONGOHQ_URL;

let parsed = url.parse(dbURL);

parsed.pathname = '/syn_replaytest';

dbURL = url.format(parsed);

describe ( 'Connect' , function () {

  it ( `should connect to ${dbURL}` , function (done) {

    try {
      Mung.connect(dbURL)
        .on('error', done)
        .on('connected', () => done());
    }
    catch ( error ) {
      done(error);
    }

  });

});

describe ( 'Clear DB' , function () {

  it ( 'should clear DB' , function (done) {

    try {
      sequencer(
        [
          'users',
          'countries',
          'criterias',
          'discussions',
          'educations',
          'employments',
          'feedback',
          'items',
          'marital_statuses',
          'political_parties',
          'races',
          'states',
          'trainings',
          'types',
          'votes',
          'mung_migrations'
        ].map(collection => () => new Promise((ok, ko) => {
          try {
            const { db } = Mung.connections[0];

            db.collection(collection)
              .remove()
              .then(ok, ko);
          }
          catch ( error ) {
            ko(error);
          }
        }))
      )
        .then(
          () => done(),
          done
        );
    }
    catch ( error ) {
      done(error);
    }

  });

});

describe ( 'Migrate' , function () {

  it ( 'should migrate' , function (done) {

    try {
      migrate().then(() => done(), done);
    }
    catch ( error ) {
      done(error);
    }

  });

});
