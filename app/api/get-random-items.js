'use strict';

import Item from '../models/item';
import QVote from '../models/qvote';
import Mungo from 'mungo';

function getRandomItems (panel, size, cb) {
  try {
    let id        =   'panel-' + panel.type._id || panel.type;
    const query   =   { type : panel.type._id || panel.type};
    const userId = this.synuser ? this.synuser.id : null;


    if ( panel.parent ) {
      const parentId = panel.parent._id || panel.parent; 
      id += '-' + parentId;
      query.parent = parentId;
    }

    if ( panel.skip ) {
      query.skip = panel.skip;
    }

    if(panel.limit) {
      query.limit = panel.limit;
    }

    if(panel.own) {
      if(userId) {
        query.user = userId;
      } else {
        cb(panel, 0); // request to get the users's own items but no user logged in so return nothing
      }
    }

    QVote.aggregate([
      // items the use has voted on
      {$match: {user: Mungo.Type.ObjectID.convert(userId)}},
      // add the itemInfo about the items the user has voted on
      { $lookup: {
        from: "items",
        localField: "item",
        foreignField: "_id",
        as: "itemInfo"
      }},
      {$unwind: "$itemInfo"},
      {$match: {"itemInfo.type":  Mungo.Type.ObjectID.convert(panel.type), "itemInfo.parent" : Mungo.Type.ObjectID.convert(panel.parent)}},
      {$group: {_id: "nin", "nin": {$addToSet: "$itemInfo._id"}}},
      {$project: {"nin": true, "_id":false }}
    ]).then(results=>{
      if(results && results.length){
        let nin=results[0].nin;
        if(nin.length) query._id={["$nin"]: nin};  // exclude items the users has already voted on
      }
      Item
      .getRandomItems(query, size, userId)
      .then(
        results => {
          try {
            if(!panel.items) { panel.items = []; }
            panel.items = panel.items.concat(results.items);
            cb(panel);
          }
          catch ( error ) {
            ko(error);
          }
        },
        this.error.bind(this)
      );
    })
  }

  catch ( error ) {
    this.error(error);
  }

}

export default getRandomItems;
