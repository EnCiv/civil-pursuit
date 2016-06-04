'use strict';

import Upvote from '../../upvote';

function countUpvote (userId) {
	console.info("Item.countUpvote", this._id);
	let itemId = this._id;
  return Upvote.getAccumulation( itemId , userId );
}

export default countUpvote;
