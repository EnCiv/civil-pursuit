'use strict';

function findCurrent () {
  return this.findOne({
    starts    :   { $gte : Date.now() },
    deadline  :   { $lt : Date.now() }
  });
}

export default findCurrent;
