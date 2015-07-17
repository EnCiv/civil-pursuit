'use strict';

import { default as mongoose, Schema } from 'mongoose';


let criteriaSchema = new Schema({
  "name"          : 	String,
  "description"   : 	String
});

export default mongoose.model('Criteria', criteriaSchema);
