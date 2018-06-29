'use strict';

import apiWrapper from '../lib/util/api-wrapper';
import ObjectID from 'bson-objectid';

function getObjectId(cb){
    setTimeout(()=>{
        var _id=new ObjectID();
        cb(ObjectID(_id).toHexString());
    })
}

export default getObjectId;
