'use strict';

function addRace (raceId) {
  if ( ! this.race ) {
    this.set('race', [raceId]);
  }

  else if ( ! this.race.length ) {
    this.push('race', raceId);
  }

  else {
    const reduce = (hasRace, _race) => {
      if ( _race.toString() === raceId.toString() ) {
        hasRace = true;
      }

      return hasRace;
    }

    const hasRace = this.race.reduce(reduce, false);

    if ( hasRace ) {
      throw new Error('Already has race');
    }

    this.push('race', raceId);
  }

  return this;
}

export default addRace;
