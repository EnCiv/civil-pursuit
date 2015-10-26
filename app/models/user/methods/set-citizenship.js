'use strict';

function setCitizenship (position, country) {
  return this.setByIndex('citizenship', { [position] : country });
}

export default setCitizenship;
