'use strict';

import Upvote from '../../upvote';

function countUpvote (userId) {
	console.info("Item.countUpvote", this);
  return Upvote.getAccumulation( this.Item._id , userId );
}

export default countUpvote;
