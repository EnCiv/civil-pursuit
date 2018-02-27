'use strict';

import QVote from '../models/qvote';
import Mungo from 'mungo';

/************** this is the mogo shell query
db.qvote.aggregate([
    // get the items the user has qvoted on
    {  $match: {"user": ObjectId( "58d752a37045720004456ddf")} // id of the user logged in
    }, 
    // add the itemInfo about the items the user has voted on
    { $lookup: {
        from: "items",
        localField: "item",
        foreignField: "_id",
        as: "itemInfo"
    }},
    // unwind iteminfo so it's not an array
    {$unwind: "$itemInfo"},
    // group the info by item's parent id, and yeild only a count (number of qvotes user has passed ansewers to the parent question )
    { $group: {_id: "$itemInfo.parent",
                count: {$sum: 1}

              }
    },
    // lookup the info of these items so we can find the parent
    { $lookup: {
        from: "items",
        localField: "_id",
        foreignField: "_id",
        as: "itemInfo"
    }},
    // unwind so itemInfo is not an array
    {$unwind: "$itemInfo"},
    // limit to the questions under this one discussion
    { $match: {"itemInfo.parent": ObjectId("59dc1446534c790004d31a53")}},
    // limit the output to just these things
    { $project: {count: 1, subject: "$itemInfo.subject", id: "$itemInfo.id"}},
    { $sort: {count: 1}}
])
********************************/

function getQVoteItemParentCount (itemId, cb) {
 const user= this.synuser ? this.synuser.id : null;
 if(!user) cb([]); // return nothing
 else {
    let itemIdObj=typeof itemId === 'string' ? Mungo.Type.ObjectID.convert(itemId) : itemId;  // if called from client api it's a string, if called on server it might be an ObjectId already
    let userIdObj=typeof user === 'string' ? Mungo.Type.ObjectID.convert(user) : user;

    let query=[
    // get all the qvotes this user has made
        {$match: {user: userIdObj}},
    // lookup the item that these qvoters are on add it as itemInfo
        {   $lookup: {
                from: "items",
                localField: "item",
                foreignField: "_id",
                as: "itemInfo"
            }
        },
    // unwind iteminfo so it's not an array
        {   $unwind: "$itemInfo"},
    // group the info by item's parent id, and yeild only a count (number of qvotes user has passed ansewers to the parent question )
        {   $group: {_id: "$itemInfo.parent",
                    count: {$sum: 1}

            }
        },
    // lookup the info of these items so we can find the parent
     {   $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "_id",
                as: "itemInfo"
            }
        },
    // unwind so itemInfo is not an array
        {   $unwind: "$itemInfo"},
    // limit to the questions under this one discussion
        {   $match: {"itemInfo.parent": itemIdObj}},
    // limit the output to just _id, count, subject (for sanity check), and id
        {   $project: {count: 1, subject: "$itemInfo.subject", id: "$itemInfo.id"}},
        {   $sort: {count: 1}} // increasing - least first
    ];
    QVote.aggregate(query)
    // results will look like 
    // { "_id" : ObjectId("59ea716f8a9dca0004781cfe"), "count" : 57, "subject" : "What services and decision-making do you seek from your City government? ", "id" : "ViakB" }
        .then(results => {
            if(!results){cb([])}  // return nothing
            else cb(results);
        })
        .catch(this.error.bind(this));
    }
}


export default getQVoteItemParentCount;
