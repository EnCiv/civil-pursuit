'use strict';

import Item from '../models/item';
import QVote from '../models/qvote';
import Mungo from 'mungo';

function getRandomItems(panel, size, cb) {
  try {
    const type = Mungo.Type.ObjectID.convert(panel.type._id || panel.type);
    const parent= panel.parent && Mungo.Type.ObjectID.convert(panel.parent._id || panel.parent) || undefined;
    const user=this.synuser ? Mungo.Type.ObjectID.convert(this.synuser.id) : null;
    if(!panel.items) panel.items=[]; // existens of items indicates that get has been tried
    if(!user) return cb(panel);

    var nin=[];
    var rawItems=[];

    function getQVoteInfo(){
      panel.items.forEach(item=>{
        nin.push(Mungo.Type.ObjectID.convert(item._id));
      });
      if(!nin.length) { // first time through - we need to check if the users has voted before
        const query={"itemInfo.type": type};
        if(parent) query["itemInfo.parent"]=parent;
        QVote.aggregate([
          { $match: { user } },// items the user has voted on
          { $sort: { item: 1, _id: 1}}, // date sorted so the last one counts
          { $group: { _id: "$item",  // for each item, keep the last criteria chosen
                      criteria: {$last: "$criteria"}
            }
          },
          { $lookup: { // add the itemInfo about the items the user has voted on
              from: "items",
              localField: "_id",
              foreignField: "_id",
              as: "itemInfo"
            }
          },
          { $unwind: "$itemInfo" }, // convert the array (of 1) to an object
          // next filter out the one's not related to this type and parent
          { $match: query }
        ]).then(qitems => {
          if (qitems && qitems.length) {
            qitems.forEach(qitem => {
              nin.push(qitem._id);
              rawItems.push(qitem.itemInfo);
              if(!panel.sections[qitem.criteria]) panel.sections[qitem.criteria]=[];
              panel.sections[qitem.criteria].push(qitem._id);
            });
          }
          getRandomRawUnsortedItems();
        })
      } else
        getRandomRawUnsortedItems();
    }

    function getRandomRawUnsortedItems() {
      const query={type};
      if(parent) query.parent=parent;
      if(nin.length) query._id = { ["$nin"]: nin };  // exclude items the users has already voted on
      Item.aggregate(
        [
            { $match: query },
            { $sample: { size: size } }
        ]
      ).then(items=>{
        if(items && items.length){
          rawItems=items.concat(rawItems);
          items.forEach(item=>{
            panel.sections.unsorted.push(item._id);
            nin.push(item._id);
          });
        }
        getUnRawItems();
      })
    };

    function getUnRawItems(){
      if(rawItems.length){
        if(rawItems.length){
          Promise.all(rawItems.map(rawItem => (new Item(rawItem, true)).toPanelItem(user)))
          .then((items)=>{
            if(items && items.length){
              items.forEach(item=>{
                panel.index[item._id]=panel.items.length;
                panel.items.push(item);
              })
            }
            completeRequest();
          })
        } else
          completeRequest();
      }
    }

    function completeRequest(){
      cb(panel);
    }

    getQVoteInfo();
  }

  catch (error) {
    this.error(error);
  }
}

export default getRandomItems;
