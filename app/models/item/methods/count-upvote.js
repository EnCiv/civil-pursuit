'use strict';

import Upvote from '../../upvote';

function countUpvote (userId) {
	console.info("Item.countUpvote");
  return Upvote.getAccumulation( { item: this} , userId );
}

export default countUpvote;
