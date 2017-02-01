'use strict';

import merge from 'lodash/merge'
import Mungo from 'mungo';


// for the item, for each QVote critera (like most, like, least), return the number of votes only counting the last vote by each users. (last is determined by largest _id of a vote)
// if user is passed, return the user's latest vote.
// also return the number of users who voted.

function getAccumulation (itemId, userId) {
  return new Promise((ok, ko) => {
    var itemA=[];
    itemId.forEach(item=>{ typeof item === 'string' ? itemA.push(Mungo.Type.ObjectID.convert(item)) : itemA.push(item); console.info("getAcc itemA", typeof item, typeof itemA[itemA.length-1])} );
    // when using mungo aggregate the filter object is passed directly to mongo. It is necessary that all id's are objects in the ObjectId from and not strings
    var query={item: {$in: itemA }};
    if(userId){ query.user = Mungo.Type.ObjectID.convert(userId)}; // get a specific user's accumulation
    console.info("get accumulation objectId", typeof userId, Mungo.Type.ObjectID.convert(userId));
    try {
      let accumulation = [];

      console.info("qvote qet Accumulation try", query);

      this
        .aggregate(
          [
              { $match: query },
              { $sort: { item: 1, user: 1, _id: 1}},
              { $group: { _id: {user: "$user", item: "$item"},
                          criteria: {$last: "$criteria"}
                        }
              },
              { $group: { _id: {item: "$_id.item", criteria: "$criteria"},
                        count: {$sum: 1}
                      }
              },
              {$group: { _id: {item: "$_id.item"},
                        results: {$push: {criteria: "$_id.criteria", count: "$count"}}
                  }
              },
              { $project:{"_id": 0,
                          item: "$_id.item",
                          results: "$results",
                        }
              }
          ]
        )
        .then(
          qvotes => {
            try {
              qvotes.forEach(jvote => {
                console.info("qvote getacc", jvote);
                var qvote={item: jvote.item,
                           results: {},
                          ownVote: null};
                jvote.results.forEach(r=>{qvote.results[r.criteria]=r.count});
                if(userId && jvote.results.length) qvote.ownVote=vote.results[0].criteria; 
                accumulation.push(qvote);
              });
              console.info("qvote get accumulation", accumulation)
              
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
