'use strict';

function removeRace (raceId) {
  console.info("user.remove-race:", raceId, this);

  this.race.filter(race => race.toString() !== raceId.toString());

  return this;
}

export default removeRace;
