'use strict';

import { default as mongoose, Schema } from 'mongoose';
import findRandom from 'mongoose-simple-random';
import getParents from './type/methods/get-parents';

let schema = new Schema({
  "name"        :     {
    type        :     String,
    unique      :     true
  },

  "harmony"     :     [{
    "type"    :     Schema.Types.ObjectId,
    "ref"     :     "Type"
  }],
  
  "parent"      :     {
    "type"      :     Schema.Types.ObjectId,
    "ref"       :     "Type"
  }
});

schema.plugin(getParents);
schema.methods.getParents = getParents;

export default mongoose.model('Type', schema);
