'use strict';

import User from '../models/user';

function removeRace (raceId, cb) {
  try {
  let userdoc =  User.findById(this.synuser.id);
  console.info("removeRace 1:", userdoc);
  let moduserdoc =userdoc.removeRace(raceId);
  console.info("removeRace 2:", userdoc, moduserdoc);
  User.save(moduserdoc)
      .then(cb, this.error.bind(this));
  }
  catch ( error ) {
    this.error(error);
  }
}

export default removeRace;
