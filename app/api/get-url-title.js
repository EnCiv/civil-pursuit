'use strict';

import getUrlTitle  from  '../lib/app/get-url-title';
import run          from  '../lib/util/run';

function socketGetUrlTitle (event, url) {
  run(
    d => {
      getUrlTitle(url)
        .then(
          title => this.ok(event, title),
          error => {
            if ( error.code === 'ETIMEDOUT' ) {
              this.ok(event,{ error : 'time out' });
            }
            else {
              this.error(error);
            }
          }
        );
    },
    error => this.emit('error', error)
  );
}

export default socketGetUrlTitle;
