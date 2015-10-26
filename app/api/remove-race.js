'use strict';

import User from '../models/user';
import Mungo from 'mungo';

function removeRace (event, raceId) {
  try {
    User
      .findById(this.synuser.id)
      .then(
        user => {
          try {
            user
              .filter('race', race => ! race.equals(Mungo.ObjectID(raceId)))
              .save()
              .then(
                this.ok.bind(this, event),
                this.error.bind(this)
              );
          }
          catch ( error ) {
            this.error(error);
          }
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default removeRace;
