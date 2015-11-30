'use strict';

import Discussion from '../models/discussion';

function getDiscussion (event) {
  try {
    Discussion
      .findCurrent()
      .then(
        discussion => this.ok(event, discussion),
        error => this.emit('error', error)
      );
  }
  catch ( error ) {
    this.error('error', error);
  }
}

export default getDiscussion;
