'use strict';

import DiscussionModel from '../models/discussion';

function getDiscussion (event, name, id) {
  try {
    let query = {};

    if ( name ) {
      query.name = name;
    }

    else if ( id ) {
      query._id = id;
    }

    DiscussionModel
      .findOne(query)
      .exec()
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
