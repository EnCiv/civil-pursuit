'use strict';


import PVote from '../models/pvote'
import {ObjectID} from 'mongodb'

export default function insertPvote(pvote,cb){
    const user=this.synuser && this.synuser.id;
    if(user){
        pvote.user=ObjectID(user);
        pvote.item=ObjectID(pvote.item);
        PVote.insert(this,pvote); // 'this' is a socket belonging to the API caller
        if(cb) cb(true);
    }else{
        if(cb) cb(false);
    }
}
