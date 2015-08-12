'use strict';

import { Domain } from 'domain';
import getUrlTitle from '../../../lib/app/get-url-title';

function preSaveItem (next, done) {
  try {
    let ItemModel = this.constructor;

    console.log('pre saving item', this);

    let d = new Domain().on('error', done);

    let packageItem = item => {
      console.log('go to next', this);
      next();

      fetchUrlTitle(item)
        .then(
          title => {
            try {

              if ( title ) {
                item.references[0].title = title;
              }

              done();
            }
            catch ( error ) {
              done(error);
            }
          }
        );
    };

    if ( this.isNew ) {
      console.log('--generating short id --');
      ItemModel
        .generateShortId()
        .then(
          id => {
            try {
              console.log('--short id--', id);
              this.id = id;
              packageItem(this);
            }
            catch ( error ) {
              done(error);
            }
          },
          done
        );
    }
    else {
      packageItem(this);
    }
  }
  catch ( error ) {
    done(error);
  }
}

function fetchUrlTitle (item) {
  return new Promise((ok, ko) => {
    try {

      let lookForTitle;

      let { references } = item;
      let [ ref ] = references;

      if ( ref ) {
        let { url, title } = ref;

        if ( ! title ) {
          lookForTitle = true;
        }
      }

      if ( lookForTitle ) {
        getUrlTitle(url)
          .then(ok, ko);
      }

      else {
        ok();
      }
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default preSaveItem;
