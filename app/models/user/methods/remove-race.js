'use strict';

function removeRace (raceId) {

  rarray = [];

  rarray = this.race.filter(r => { 
  		return(r != raceId) 
  	});

  this.set('race', rarray);

  return this;
}

export default removeRace;
