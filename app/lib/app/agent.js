'use strict';

import fs             from 'fs';
import superagent     from 'superagent';
import Config         from '../../../public.json';

class Agent {
  static request (url, options = {}) {
    const method = (options.method || 'get').toLowerCase();

    const request = superagent[method](url);

    request.timeout(options.timeout || 1000 * 8);

    request.set('User-Agent', options.userAgent || Config.userAgent);

    return request;
  }

  static promise (request) {
    return new Promise((ok, ko) => {
      try {
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
    return this.promise(this.request(url, options));
  }

  static download (url, dest, options = {}) {
    return new Promise((ok, ko) => {
      try {
        const pipe = fs.createWriteStream(dest);
        this
          .request(url, options)
          .pipe(pipe)
          .on('error', error => ko)
          .on('finish', ok);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default Agent;
