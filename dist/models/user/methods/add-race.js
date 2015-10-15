'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function addRace(race) {
  if (!this.race) {
    this.set('race', [race]);
  } else if (!this.race.length) {
    this.push('race', race);
  } else {
    var reduce = function reduce(hasRace, _race) {
      if (_race.toString() === race.toString()) {
        hasRace = true;
      }

      return hasRace;
    };

    var hasRace = this.race.reduce(reduce, false);

    if (hasRace) {
      throw new Error('Already has race');
    }

    this.push('race', race);
  }

  return this;
}

exports['default'] = addRace;
module.exports = exports['default'];