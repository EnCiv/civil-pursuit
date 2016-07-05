'use strict';

function setCitizenship (position, country) {
	console.info("user.setCiticenship", this, position, country);
  return this.setByIndex('citizenship', { [position] : country });
}

export default setCitizenship;
