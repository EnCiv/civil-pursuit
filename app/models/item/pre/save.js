'use strict';

import { Domain } from 'domain';
import getUrlTitle from 'syn/lib/util/get-url-title';

function preSaveItem (next, done) {
  try {
    let ItemModel = this.constuctor;

    let d = new Domain().on('error', done);

    let packageItem = item => {
      next();
      
      fetchUrlTitle(item)
        .then(
          title => {
            if ( title ) {
              item.references[0].title = title;
            }

            done();
          }
        );
    };

    if ( this.isNew ) {
      ItemModel
        .generateShortId()
        .then(
          id => {
            this.id = id;
            packageItem(this);
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
  });
}

export default preSaveItem;
