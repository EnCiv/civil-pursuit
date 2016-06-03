'use strict';

import Upvote from '../../upvote';

function countUpvote (userId) {
	console.info("Item.countUpvote", this.item._id);
  return Upvote.getAccumulation( this.item._id , userId );
}

export default countUpvote;
