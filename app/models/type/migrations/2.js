'use strict';

import fixtures from '../../../../fixtures/type/1.json';
import parents from '../../../../fixtures/type/2.json';
import harmonies from '../../../../fixtures/type/3.json';
import Mungo from 'mungo';

const collection = 'types';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        const createTypes = props => new Promise((ok, ko) => {
          try {
            this
              .create(fixtures.map(fixture => {
                fixture.__V = 2;
                return fixture;
              }))
              .then(
                created => {
                  props.created = created.map(created => created.toJSON());
                  ok();
                },
                ko
              );
          }
          catch ( error ) {
            ko(error);
          }
        });

        const applyParents = props => new Promise((ok, ko) => {
          try {
            props.created = props.created.map(created => {
              parents.forEach(parent => {
                if ( parent.name === created.name ) {
                  created.parent = props.created.reduce((match, doc) => {
                      if ( doc.name === parent.parent ) {
                        match = doc;
                      }
                      return match;
                    },
                    null
                  );
                }
              });
              return created;
            });

            const promises = props.created
              .filter(created => created.parent)
              .map(created => this.updateById(created._id, { parent : created.parent }));

            Promise.all(promises).then(ok, ko);
          }
          catch ( error ) {
            ko(error);
          }
        });

        const applyHarmony = props => new Promise((ok, ko) => {
          try {
            props.created = props.created.map(created => {
              harmonies.forEach(harmony => {
                if ( harmony.name === created.name ) {
                  created.harmony = props.created.reduce((matches, doc) => {
                      if ( harmony.harmony.indexOf(doc.name) > -1 ) {
                        matches.push(doc);
                      }
                      return matches;
                    },
                    []
                  );
                }
              });
              return created;
            });

            const promises = props.created
              .filter(created => created.harmony)
              .map(created => this.updateById(created._id, { harmony : created.harmony }));

            Promise.all(promises).then(ok, ko);
          }
          catch ( error ) {
            ko(error);
          }
        });

        const saveMigrations = props => Mungo.Migration
          .create({
            collection,
            version : 2,
            created : props.created.map(doc => doc._id)
          });

        this.find([{ __V : 2 }, { name : 'Intro' }], { limit : false })
          .then(
            documents => {
              try {
                if ( documents.length ) {
                  return ok();
                }

                Mungo.runSequence([
                  createTypes,
                  applyParents,
                  applyHarmony,
                  saveMigrations
                ]).then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static undo () {
    return Mungo.Migration.undo(this, 2, collection);
  }
}

export default V2;
