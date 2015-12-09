'use strict';

function findCurrent () {
  return this.findOne({
    starts    :   { $gte : new Date() },
    deadline  :   { $lte : new Date() }
  });
}

export default findCurrent;
