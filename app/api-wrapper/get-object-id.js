'use strict';

import apiWrapper from '../lib/util/api-wrapper';
import Mungo from 'mungo';

function getObjectId(cb){
    setTimeout(()=>{
        var _id=new Mungo.mongodb.ObjectID();
        cb(Mungo.mongodb.ObjectID(_id));
    })
}

export default getObjectId;
