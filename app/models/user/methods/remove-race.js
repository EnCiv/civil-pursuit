'use strict';

function removeRace (raceId) {
  console.info("user.remove-race:", raceId, this);

  this.race = this.race.filter(r => { 
  		console.info("user.remove-race infilter", r, raceId, r != raceId);
  		return(r != raceId) 
  	});

  console.info("user.remover-race after", this);

  return this;
}

export default removeRace;
