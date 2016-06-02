'use strict';

import Upvote from '../../upvote';

function countUpvote () {
	console.info("Item.countUpvote", { item: this} );
  return Upvote.getAccumulation( { item: this} );
}

export default countUpvote;
