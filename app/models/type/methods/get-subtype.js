'use strict';

function getSubtype () {
  return this.constructor.findOne({ parent : this });
}

export default getSubtype;
