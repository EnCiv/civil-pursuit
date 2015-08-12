'use strict';

import S              from 'string';
import request        from 'request';
import config         from '../../../secret.json';
import run            from '../util/run';

function getUrlTitle (url) {
  return new Promise((ok, ko) => {
    let req = {
      url             :   url,
      timeout         :   1000 * 8,
      headers         :   {
        'User-Agent'  :   config['user agent']
      }
    };
    request(req, (error, response, body) => {
      if ( error ) {
        return ko(error);
      }

      if ( response.statusCode === 200 ||
        ( response.statusCode >= 300  && response.statusCode < 400 ) ) {

        let title;

        body

          .replace(/\r/g, '')

          .replace(/\n/g, '')

          .replace(/\t/g, '')

          .replace(/<title>(.+)<\/title>/, (matched, _title) => {

            title = S(_title).decodeHTMLEntities().s;

          });

        ok(title);
      }
      else {
        ko(new Error('Got status code ' + response.statusCode));
      }
    });
  });
}

export default getUrlTitle;
