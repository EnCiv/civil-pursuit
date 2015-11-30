'use strict';

function removeRace (raceId) {
  if ( '_id' in raceId ) {
    raceId = raceId._id;
  }

  this.filter('race', race => race.toString() !== raceId.toString());

  return this;
}

export default removeRace;
