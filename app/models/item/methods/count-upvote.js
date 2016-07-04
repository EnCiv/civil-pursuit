'use strict';

import Upvote from '../../upvote';

function countUpvote (userId) {
	let itemId = this._id;
  return Upvote.getAccumulation( itemId , userId );
}

export default countUpvote;
