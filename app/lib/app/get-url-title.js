'use strict';

import S from 'string';
import superagent from 'superagent';
import config from '../../../secret.json';

function getUrlTitle(url) {
  return new Promise((ok, ko) => {
    try {
      superagent.get(url)
        .set('User-Agent', config['user agent'])
        .timeout(8000)
        .end((err, res) => {
          if (err) {
            ok({ error: err.toString() })
          } else {
            var title;
            res.text
              .replace(/\r/g, '')
              .replace(/\n/g, '')
              .replace(/\t/g, '')
              .replace(/<title>(.+)<\/title>/, (matched, _title) => {
                title = S(_title).decodeHTMLEntities().s;
              });
            ok(title);
          }
        })
    }
    catch (error) {
      ko(error);
    }
  });
}

export default getUrlTitle;
