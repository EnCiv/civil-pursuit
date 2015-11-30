'use strict';

function set (name, value) {
  return this.create({ name, value });
}

export default set;
