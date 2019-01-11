'use strict';


import PVote from '../models/pvote'
import {ObjectID} from 'mongodb'

export default function insertPvote(pvote,cb){
    const user=this.synuser && this.synuser.id;
    if(!user) return cb(false);
    pvote.user=ObjectID(user);
    pvote.item=ObjectID(pvote.item);
    PVote.insert(pvote);
    cb(true);
}
