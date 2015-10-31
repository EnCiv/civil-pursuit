'use strict';

import getUrlTitle from '../../../lib/app/get-url-title';

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
        getUrlTitle(ref.url)
          .then(
            title => {
              try {
                if ( title ) {
                  return item
                    .map('references', reference => {
                      reference.title = title;
                      return reference;
                    })
                    .save()
                    .then(ok, ko);
                }

                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            error => {
              ko(error);
            }
          );
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

export default fetchUrlTitle;
