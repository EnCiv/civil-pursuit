'use strict';

import { default as mongoose, Schema } from 'mongoose';

try {
  require('./type');
}
catch ( error ) {}

let criteriaSchema = new Schema({
  "name"          : 	String,
  "description"   : 	String,
  "type"          :   {
    "type"        :   Schema.Types.ObjectId,
    "ref"         :   "Type"
  }
  // "type":String
});

export default mongoose.model('Criteria', criteriaSchema);
