'use strict';

import StoryModel from '../models/story';

function getStories (event) {
  try {
    StoryModel
      .find()
      .populate('driver.page')
      .exec()
      .then(
        stories => this.ok(event, stories),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getStories;
