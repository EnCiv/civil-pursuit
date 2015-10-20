'use strict';

import Discussion from '../models/discussion';

function getDiscussion (event, name, id) {
  try {
    let query = {};

    if ( name ) {
      query.name = name;
    }

    else if ( id ) {
      query._id = id;
    }

    Discussion
      .findOne(query)
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
