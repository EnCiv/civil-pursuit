'use strict';

function addRace (race) {
  if ( ! this.race ) {
    this.set('race', [race]);
  }

  else if ( ! this.race.length ) {
    this.push('race', race);
  }

  else {
    const reduce = (hasRace, _race) => {
      if ( _race.toString() === race.toString() ) {
        hasRace = true;
      }

      return hasRace;
    }

    const hasRace = this.race.reduce(reduce, false);

    if ( hasRace ) {
      throw new Error('Already has race');
    }

    this.push('race', race);
  }

  return this;
}

export default addRace;
