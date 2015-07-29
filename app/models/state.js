'use strict';

import { default as mongoose, Schema } from 'mongoose';

let schema = new Schema({
  "name"          :   {
    "type"        :   String,
    "required"    :   true
  }
});

export default mongoose.model('State', schema);
