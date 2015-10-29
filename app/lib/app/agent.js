'use strict';

import superagent     from 'superagent';
import config         from '../../../secret.json';

class Agent {
  static request (url, options = {}) {
    return new Promise((ok, ko) => {
      try {
        const method = (options.method || 'get').toLowerCase();

        const request = superagent[method](url);

        request.timeout(options.timeout || 1000 * 25);

        request.set('User-Agent', options.userAgent || config['user agent']);

        request.end((err, res) => {
          try {
            if ( err ) {
              throw err;
            }
            ok(res.res, res.req);
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

  static get (url, options = {}) {
    options.method = 'GET';
    return this.request(url, options);
  }
}

export default Agent;
