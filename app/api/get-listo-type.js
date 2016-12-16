'use strict';

import sequencer    from 'promise-sequencer';
import Type         from '../models/type';
import Config       from '../models/config';
// import {ObjectId}   from 'mongo';

function getListoType (typeIdList, cb) {
  var ids = typeIdList.map(function(id) { return ({ "_id": id}); });
  console.info("getListoType", ids);
  Type.find({ "_id": {$in: ids} })
  .then(typeList => cb(typeList.map(type=>type.toJSON())))
  .catch(this.error.bind(this));
}

export default getListoType;