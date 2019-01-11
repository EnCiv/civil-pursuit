'use strict';


import PVote from '../models/pvote'
import {ObjectID} from 'mongodb';

export default function subscribePvoteInfo(itemId,cb){
    const user=this.synuser && this.synuser.id;
    if(!user) return cb(false);
    PVote.subscribe(ObjectID(itemId),ObjectID(user),this.socket);
    cb(true);
}
