'use strict';

import { Schema, default as mongoose }    from 'mongoose';
import findRandom           from 'mongoose-simple-random';
import getAccumulation      from 'syn/models/vote/statics/get-accumulation';

try {
  mongoose.model('User');
}
catch ( error ) {
  require('syn/models/user');
}

try {
  mongoose.model('Item');
}
catch ( error ) {
  require('syn/models/item');
}

try {
  mongoose.model('Criteria');
}
catch ( error ) {
  require('syn/models/criteria');
}

let VoteSchema       =   new Schema({
  "item"             :   {
  	"type"           :   Schema.Types.ObjectId,
  	"ref"            :   "Item",
  	"required"       :   true
  },
  "criteria"         :   {
  	"type"           :   Schema.Types.ObjectId,
  	"ref"            :   "Criteria",
  	"required"       :   true
  },
  "user"             :   {
  	"type"           :   Schema.Types.ObjectId,
  	"ref"            :   "User",
  	"required"       :   true
  },
  "value"            :   {
  	"type"           :   Number,
  	"required"       :   true
  }
});

VoteSchema.plugin(findRandom);

/** Get Accumulation...
 *
 *  @method model::Vote::get-accumulation
 *  @param {String} item - Restrict to item
 *  @param {updateById~cb} cb - The callback
 *  @return {Object}
 */

VoteSchema.statics.getAccumulation = getAccumulation;

export default mongoose.model('Vote', VoteSchema);
