'use strict';

import Discussion from '../models/discussion';

function getDiscussion (cb) {
  Discussion
    .findCurrent()
    .then(cb)
    .catch(error => this.emit('error', error));
}

export default getDiscussion;
