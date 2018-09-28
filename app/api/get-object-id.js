'use strict';

import Mungo from 'mungo';


function getObjectId (cb) {
    var gid=new Mungo.mongodb.ObjectID();
    cb(Mungo.mongodb.ObjectID(gid));
}

export default getObjectId;
