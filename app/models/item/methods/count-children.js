'use strict';

function countChildren () {
  return this.constructor.count({ parent : this });
}

export default countChildren;
