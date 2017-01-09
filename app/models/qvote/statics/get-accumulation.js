'use strict';

// for the item, for each QVote critera (like most, like, least), return the number of votes only counting the last vote by each users. (last is determined by largest _id of a vote)
// if user is passed, return the user's latest vote.
// also return the number of users who voted.

function getAccumulation (itemId, userId) {
  return new Promise((ok, ko) => {
    var query={item: itemId};
    if(user){ query.user = userId} // get a specific user's accumulation
    console.info("QVote.getAccumulation",query, item);
    try {
      let accumulation = {results: {}, count: 0};
      var lastUser=null;
      var result={};
      var users=0;

      this
        .find(query)
        .sort({ user : 1, _id : -1})
        .then(
          qvotes => {
            try {
              qvotes.forEach(vote => {
                if(vote.user!==lastUser) {
                    users++;
                    lastUser=vote.user;
                    if(!result[vote.criteria]){result[criteria]=1}
                    else {result[criteria]++}
                }
              });
              Object.assign(accumulation.results,results);
              accumulation.count=users;
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
