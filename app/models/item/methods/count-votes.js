'use strict';

import Vote from '../../vote';

function countVotes () {
  return Vote.count({ item : this });
}

export default countVotes;
