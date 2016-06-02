'use strict';

import Upvote from '../../upvote';

function countUpvote () {
	console.info("Item.countUpvote", { item: this}, this.synuser.id);
  return Upvote.getAccumulation( { item: this} , this.synuser.id);
}

export default countUpvote;
