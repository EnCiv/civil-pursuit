'use strict';

import { default as mongoose, Schema } from 'mongoose';

let schema = new Schema({
  "name"          :   {
    "type"        :   String,
    "required"    :   true
  },
  "type"          :   {
    "type"        :   String, /* "page", "component" */
    "required"    :   true
  },
  "ref"           :   {
    "type"        :   String, /* file name */
    "required"    :   true
  }
});

export default mongoose.model('Test', schema);
