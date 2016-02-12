'use strict';

import getUrlTitle from '../lib/app/get-url-title';

function apiGetUrlTitle (url, cb) {
  getUrlTitle(url)
    .then(cb)
    .catch(error => this.emit('error', error));
}

export default apiGetUrlTitle;
