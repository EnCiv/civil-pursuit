'use strict';

import url                  from 'url';
import should               from 'should';
import mongodb              from 'mongodb';
import Mungo                from 'mungo';
import sequencer            from '../lib/util/sequencer';
import describe             from '../lib/util/describe';
import User                 from '../models/user';
import migrate              from '../bin/migrate';

let dbURL = process.env.MONGOHQ_URL;

const parsed = url.parse(dbURL);

parsed.pathname = '/syn_replaytest';

dbURL = url.format(parsed);

function test () {
  return describe ( 'DB', [

    {
      [`should connect to ${dbURL}`] : (ok, ko) => {
        try {
          Mungo.connect(dbURL)
            .on('error', ko)
            .on('connected', ok);
        }
        catch ( error ) {
          ko(error);
        }
      }
    },

    {
      'should clear DB' : (ok, ko) => sequencer(
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
          'mungo_migrations',
          'config'
        ].map(collection => () => new Promise((ok, ko) => {
          try {
            const { db } = Mungo.connections[0];

            db.collection(collection)
              .remove()
              .then(ok, ko);
          }
          catch ( error ) {
            ko(error);
          }
        }))
      ).then(ok, ko)
    },

    {
      'should migrate' : (ok, ko) => migrate().then(ok, ko)
    }

  ]);
}

export default test;
