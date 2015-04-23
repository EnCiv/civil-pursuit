! function () {
  
  'use strict';

  var Model;

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'mongoose',
    'mongoose-simple-random',
    'syn/models/Item/schema',
    'syn/models/Item/pre/validate',
    'syn/models/Item/pre/save',
    'syn/models/Item/post/init',
    'syn/lib/util/to-slug',
    'syn/lib/util/to-camel-case'
  ]
    .map(function (dep) {
      return require(dep);
    });

  function run (mongoose, findRandom, schema, preValidate, preSave, postInit, toSlug, toCamelCase) {
    
    var ItemSchema = new mongoose.Schema(schema);

    ItemSchema

      .plugin(findRandom)

      .pre('validate', preValidate)

      .pre('save', preSave)

      .post('init', postInit);

    // STATIC METHODS
    // ==============

    var statics = [
      'Disposable',
      'Generate Short ID',
      'Get Panel Items'
    ];

    statics.forEach(function (_static) {
      ItemSchema.statics[toCamelCase(_static)] =
        require('syn/models/Item/statics/' + toSlug(_static));
    });

    // METHODS
    // =======

    var methods = [
      'Get Image Html',
      'Get Popularity',
      'To Panel Item'
    ];

    methods.forEach(function (_method) {
      ItemSchema.methods[toCamelCase(_method)] =
        require('syn/models/Item/methods/' + toSlug(_method));
    });

    Model = mongoose.model('Item', ItemSchema);
  
  }

  run.apply(null, deps);

  module.exports = Model;

} ();
