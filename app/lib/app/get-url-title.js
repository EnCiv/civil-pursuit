'use strict';

import S              from 'string';
import Agent          from './agent';

function getUrlTitle (url) {
  return new Promise((ok, ko) => {
    try {
      Agent.get(url).then(
        res => {
          try {
            let title;

            res.text

              .replace(/\r/g, '')

              .replace(/\n/g, '')

              .replace(/\t/g, '')

              .replace(/<title>(.+)<\/title>/, (matched, _title) => {

                title = S(_title).decodeHTMLEntities().s;

              });

            ok(title);
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

export default getUrlTitle;
