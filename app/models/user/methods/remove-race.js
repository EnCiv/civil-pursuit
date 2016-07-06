'use strict';

function removeRace (raceId) {

  this.race = this.race.filter(r => { 
  		return(r != raceId) 
  	});

  return this;
}

export default removeRace;
