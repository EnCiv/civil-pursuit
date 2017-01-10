'use strict';

// for the item, for each QVote critera (like most, like, least), return the number of votes only counting the last vote by each users. (last is determined by largest _id of a vote)
// if user is passed, return the user's latest vote.
// also return the number of users who voted.

function getAccumulation (itemId, userId) {
  return new Promise((ok, ko) => {
    var query={item: {$in: itemId }};
    if(userId){ query.user = userId} // get a specific user's accumulation
    console.info("QVote.getAccumulation",query, itemId);
    try {
      let accumulation = [];
      var lastUser=null;
      var lastItem=null;

      this
        .find(query)
        .sort({ item: 1, user : 1, _id : -1})
        .then(
          qvotes => {
            try {
              qvotes.forEach(vote => {
                if(!lastItem) {lastItem={item: vote.item, results: {}, ownVote: null}} // first time through
                if(vote.item !== lastItem.item){
                  Object.assign(lastItem, results);
                  accumulation.push(lastItem);
                  lastItem.item=vote.item;
                  lastItem.results={};
                  lastItem.ownVote=null;
                  lastUser=null;
                }
                if(vote.user!==lastUser) { // only count the last vote by each user, which is the first in the list because it's sorted -1 by _id
                    let criteria=vote.criteria;
                    lastUser=vote.user;
                    if(!result[criteria]){result[criteria]=1}
                    else {result[criteria]++}
                    if(lastUser === userId){
                      lastItem.ownVote=criteria;
                    }
                } // if it is equal to the last user we just skip it because we are only counting the 
              });
              
              ok(accumulation);
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getAccumulation;
