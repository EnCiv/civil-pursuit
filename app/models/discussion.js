'use strict';

import { default as mongoose, Schema } from 'mongoose';
import UserModel from './user';

let schema = new Schema({
  "name"          :   {
    "type"        :   String,
    "required"    :   true
  },
  "deadline"      :   {
    "type"        :   Date,
    "required"    :   true
  },
  "goal"          :   {
    "type"        :   Number,
    "required"    :   true
  },
  "registered"    :   [{
    "type"        :   Schema.Types.ObjectId,
    "required"    :   true,
    "ref"         :   'User'
  }]
});

export default mongoose.model('Discussion', schema);
