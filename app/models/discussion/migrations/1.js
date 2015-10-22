'use strict';

import Mung from 'mung';

const collection = 'discussions';

class V1 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        const documentsWithNoVersion = { __V : { $exists : false } };

        const findDocumentsWithNoVersion = props => new Promise((ok, ko) => {
          try {
            this
              .find(documentsWithNoVersion, { limit : false })
              .then(
                documents => {
                  try {
                    props.documentsWithNoVersion = documents;
                    ok();
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

        const saveDocumentsWithNoVersion = props => new Promise((ok, ko) => {
          try {
            if ( ! props.documentsWithNoVersion.length ) {
              return ok();
            }
            Mung.Migration
              .create({
                collection,
                version : 1,
                undo : props.documentsWithNoVersion.map(doc => ({
                  id : doc._id,
                  unset : [ '__V' ]
                }))
              })
              .then(ok, ko);
          }
          catch ( error ) {
            ko(error);
          }
        });

        const tagDocuments = props => new Promise((ok, ko) => {
          try {
            if ( ! props.documentsWithNoVersion.length ) {
              return ok();
            }
            this
              .update(documentsWithNoVersion, { __V : 2 })
              .then(ok, ko);
          }
          catch ( error ) {
            ko(error);
          }
        });

        Mung
          .runSequence([
            findDocumentsWithNoVersion,
            saveDocumentsWithNoVersion,
            tagDocuments
          ])
          .then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static undo () {
    return Mung.Migration.undo(this, 1, collection);
  }
}

export default V1;
