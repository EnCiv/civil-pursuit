'use strict';

import Item from '../models/item';
import Mungo from 'mungo';

export default function getItemsQvoteSort(parentStr, typeStr, sort, skip, limit, cb) {
    try {
        const parent = Mungo.mongodb.ObjectID(parentStr);
        const type = Mungo.mongodb.ObjectID(typeStr);
        const user=this.synuser ? Mungo.mongodb.ObjectID(this.synuser.id) : null;
        var sortQvotes={};
        Object.keys(sort).forEach(key=>sortQvotes['qvotes.'+key]=sort[key]);
        Item.aggregate([
            {
                $match: { parent, type }
            },
            { $project: { _id: 1 } },
            {
                $lookup: {
                    from: "qvote",
                    localField: "_id",
                    foreignField: "item",
                    as: "qvotes"
                }
            },
            { $unwind: {path: "$qvotes", preserveNullAndEmptyArrays: true }},
            { $sort: { "qvotes._id": 1 } },
            { $group: { _id: { item: "$_id", user: "$qvotes.user" }, criteria: { $last: "$qvotes.criteria" } } },
            { $addFields: {criteria: {$ifNull: ["$criteria","_none"]}}},
            {
                $group: {
                    _id: { item: "$_id.item", criteria: "$criteria" },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.item",
                    qvotes: { $push: { criteria: "$_id.criteria", count: "$count" } }
                }
            },
            {
                $project: {
                    _id: 1,
                    qvotes: {
                        $arrayToObject: {
                            $map: {
                                input: "$qvotes",
                                as: "el",
                                in: {
                                    k: "$$el.criteria",
                                    v: "$$el.count"
                                }
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "_id",
                    as: "item"
                }
            },
            { $unwind: "$item" },
            { $replaceRoot: { newRoot: { $mergeObjects: ["$item", { "qvotes": "$qvotes" }] } } },
            { $sort: sortQvotes },
            { $group: { _id: null, total: { $sum: 1 }, results: { $push: "$$ROOT" } } },
            { $project: { total: 1, results: { $slice: ["$results", skip, limit] } } }
        ]).then(results=>{
            const result=results && results[0] || null;
            if(!result || !result.total) return cb([],0);
            const total=result.total;
            Promise.all(result.results.map(rawItem => {
                const qvotes=rawItem.qvotes;
                return new Item(rawItem, true)
                    .toPanelItem(user)
                    .then(item=>(item.qvotes=qvotes,item));f
            })).then(itemsWithQvotes=>
                cb(itemsWithQvotes,total)
            )}, 
            (error)=>{cb([],0); this.error(error)}
        )
    }
    catch (error) {
        this.error(error);
    }
}