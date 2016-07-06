'use strict';

function removeRace (raceId) {

  this.filter('race', race => race.toString() !== raceId.toString());

  return this;
}

export default removeRace;
