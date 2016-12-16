'use strict';

import sequencer    from 'promise-sequencer';
import Type         from '../models/type';
import Config       from '../models/config';
import {ObjectId}   from 'mongo';

function getListOfType (typeIdList, cb) {
  var ids = typeIdList.map(function(id) { return ObjectId(id); });
    
  Type.find({ _id :{$in: ids} })
  .then(typeList => cb(typeList.toJSON()))
  .catch(this.error.bind(this));
}

export default getListOfType;
