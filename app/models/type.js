'use strict';

import { default as mongoose, Schema } from 'mongoose';
import findRandom     from 'mongoose-simple-random';
import getParents     from './type/methods/get-parents';
import isHarmony      from './type/methods/is-harmony';
import getOpposite    from './type/methods/get-opposite';

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

schema.plugin(findRandom);

schema.methods.getParents     =   getParents;
schema.methods.isHarmony      =   isHarmony;
schema.methods.getOpposite    =   getOpposite;

export default mongoose.model('Type', schema);
