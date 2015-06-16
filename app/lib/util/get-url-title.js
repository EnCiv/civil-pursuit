'use strict';

import S from 'string';
import request from 'request';
import config from 'syn/config.json';
import run from 'syn/lib/util/run';

function getUrlTitle (url) {
  return new Promise((ok, ko) => {
    let req = {
      url             :   url,
      timeout         :   1000 * 5,
      headers         :   {
        'User-Agent'  :   config['user agent']
      }
    };
    request(req, (error, response, body) => {
      if ( error ) {
        return ko(error);
      }
      if ( response.statusCode === 200 ) {

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
