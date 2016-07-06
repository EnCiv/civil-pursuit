'use strict';

function removeRace (raceId) {
  console.info("user.remove-race:", raceId, this);

  this.race.filter(race => race != raceId);

  console.info("user.remover-race after", this);

  return this;
}

export default removeRace;
