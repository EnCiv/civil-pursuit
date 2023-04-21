'use strict';

import sequencer from 'promise-sequencer';
import Type from '../models/type';
import Config from '../models/config';
// import {ObjectId}   from 'mongo';  this created a conflice with io() in app/client/main 

function getListoType(typeIdList, cb) {
	var ids = typeIdList.map(id => ({ "_id": id }));
	Type.find({ "_id": { $in: ids } })
		.then(typeList => {
			if (!typeList) return cb(false);
			let randomList = typeList.map(type => type.toJSON());  //convert db response to objects
			cb(typeIdList.map(id => randomList.find(type => type._id == id))) // return objects in order of input request
		})
		.catch(this.error.bind(this));
}

export default getListoType;