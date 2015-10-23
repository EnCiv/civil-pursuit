'use strict';

import Mungo from 'mungo';

const collection = 'states';

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
            Mungo.Migration
              .create({
                collection,
                version : 1,
                changed : props.documentsWithNoVersion.map(doc => doc._id)
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

        Mungo
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
    return Mungo.Migration.undo(this, 1, collection);
  }
}

export default V1;
