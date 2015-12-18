'use strict';

function findCurrent () {
  return this.findOne({
    starts    :   { $lte : new Date() },
    deadline  :   { $gte : new Date() }
  });
}

export default findCurrent;
