'use strict';

import { default as mongoose, Schema }  from 'mongoose';
import findRandom                       from 'mongoose-simple-random';

import schema                           from './item/schema';
import preValidate                      from './item/pre/validate';
import preSave                          from './item/pre/save';
import postInit                         from './item/post/init';
import toCamelCase                      from  '../lib/util/to-camel-case';
import toSlug                           from  '../lib/util/to-slug';

let itemSchema = new Schema(schema);

itemSchema

  .plugin(findRandom)

  .pre('validate', preValidate)

  .pre('save', preSave)

  .post('init', postInit);


// STATIC METHODS
// ==============

let statics = [
  'Disposable',
  'Evaluate',
  'Generate Short ID',
  'Get Details',
  'Get Item',
  'Get Panel Items',
  'Increment Promotion',
  'Increment View',
  'Insert'
];

for ( let _static of statics ) {
  itemSchema.statics[toCamelCase(_static)] =
    require('./item/statics/' + toSlug(_static));
};

// METHODS
// =======

let methods = [
  'Get Image Html',
  'Get Lineage',
  'Get Popularity',
  'To Panel Item'
];

for ( let _method of methods ) {
  itemSchema.methods[toCamelCase(_method)] =
    require('./item/methods/' + toSlug(_method));
};

export default mongoose.model('Item', itemSchema);
