'use strict';

import should               from 'should';
import mongodb              from 'mongodb';
import sequencer            from '../../app/lib/util/sequencer';
import Mung                 from '../../app/lib/mung';
import User                 from '../../app/models/user';
import migrate              from '../../app/bin/migrate';

describe ( 'Connect' , function () {

  it ( 'should connect' , function (done) {

    try {
      Mung.connect(process.env.MONGO_TEST)
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
          'votes'
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
