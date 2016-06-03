'use strict';

import Upvote from '../../upvote';

function countUpvote (userId) {
	console.info("Item.countUpvote", this, this.Item, this._id);
	let itemId = this.Item._id;
  return Upvote.getAccumulation( itemId , userId );
}

export default countUpvote;
