'use strict';

import fixtures from '../../../../fixtures/state/1.json';
import Mungo from 'mungo';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 })
          .then(
            documents => {
              try {
                if ( documents.length ) {
                  return ok();
                }
                this
                  .create(fixtures)
                  .then(
                    created => {
                      try {
                        Mungo.Migration
                          .create({
                            model : this.name,
                            collection : this.toCollectionName(),
                            version : 2,
                            created : created.map(doc => doc._id)
                          })
                          .then(ok, ko);
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
    return new Promise((ok, ko) => {
      try {
        const getSavedDocuments = props => new Promise((ok, ko) => {
          try {
            Mungo.Migration
              .findOne({
                model : this.name,
                collection : this.toCollectionName(),
                version : 2
              }, { limit : false })
              .then(
                document => {
                  try {
                    props.documents = document.created.map(doc => doc._id);
                    ok();
                  }
                  catch ( error ) {
                    ko(error);
                  }
                },
                ko
              );

            const deleteDocuments = props => this.removeByIds(...props.documents);

            Mungo
              .runSequence([
                getSavedDocuments,
                deleteDocuments
              ])
              .then(ok, ko);
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default V2;
