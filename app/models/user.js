'use strict';

import { default as mongoose, Schema }  from  'mongoose';
import findRandom                       from  'mongoose-simple-random';
import userSchema                       from  './user/schema';
import preSave                          from  './user/pre/save';
import toCamelCase                      from  '../lib/util/to-camel-case';
import toSlug                           from  '../lib/util/to-slug';

let schema = new Schema(userSchema);

let statics = [
  'Identify',
  'Reset password',
  'Make password resettable',
  'Is password valid',
  'Save image',
  'Add Race',
  'Remove Race',
  'Set marital status',
  'Set employment',
  'Set education',
  'Set citizenship',
  'Set birthdate',
  'Set gender',
  'Set registered voter',
  'Set party',
  'Disposable'
];

for ( let _static of statics ) {
  schema.statics[toCamelCase(_static)] = require(
    './user/statics/' + toSlug(_static)
  );
}

let virtuals = [
  'Full name'
];

for ( let virtual of virtuals ) {
  let _virtual = './user/virtuals/' + toSlug(virtual) + '/get';

  schema
    .virtual(toCamelCase(virtual))
    .get(require(_virtual));
}

schema
  .plugin(findRandom)
  .pre('save', preSave);

export default mongoose.model('User', schema);
