'use strict';

function removeRace (raceId) {

  let rarray = [];

  rarray = this.race.filter(r => { 
  		return(r != raceId) 
  	});

  this.set('race', rarray);

  return this;
}

export default removeRace;
