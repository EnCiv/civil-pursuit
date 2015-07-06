'use strict';

import getUrlTitle  from  '../lib/app/get-url-title';
import run          from  '../lib/util/run';

function socketGetUrlTitle (event, url) {
  run(
    d => {
      getUrlTitle(url)
        .then(
          title => this.ok(event, title),
          error => this.error(error)
        );
    },
    this.error.bind(this)
  );
}

export default socketGetUrlTitle;
