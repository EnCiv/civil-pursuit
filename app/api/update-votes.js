'use strict';

import Vote from '../models/vote';
import Mungo from 'mungo';


function updateVotes (votes) {
  try {
    if(!this.synuser) return;
    votes.forEach(vote=>{
        if(vote.user !== this.synuser.id){logger.error("updateVotes", this.synuser.id, "is trying to update votes for ", vote.user, vote); return}
        const query={item: vote.item, criteria: vote.criteria, user: this.synuser.id };
        if(vote._id) query._id=vote._id;
        Vote.update(query, vote, {upsert: true}).then(
            (result)=>{console.info("updateVotes",result)}
        ,
        this.error.bind(this)
        )
    })
  }
  catch ( error ) {
    this.error(error);
  }
}

export default updateVotes;
