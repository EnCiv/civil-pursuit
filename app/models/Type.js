! function () {
  
  'use strict';

  var mongoose        =     require('mongoose');

  var Schema          =     mongoose.Schema;

  var findRandom      =     require('mongoose-simple-random');

  var getParents      =     require('syn/models/Type/methods/get-parents');

  var TypeSchema      =     new Schema({

    "name"        :     {
      type        :     String,
      unique      :     true
    },
    // "harmony"     :     [{
    //   "name"      :     Schema.Types.ObjectId
    // }],
    // "parent"      :     Schema.Types.ObjectId
    "harmony"     :     [{
      "type"    :     Schema.Types.ObjectId,
      "ref"     :     "Type"
    }],
    "parent"      :     {
      "type"      :     Schema.Types.ObjectId,
      "ref"       :     "Type"
    }

  });

  TypeSchema.plugin(findRandom);

  TypeSchema.methods.getParents = getParents;

  module.exports = mongoose.model('Type', TypeSchema);

} ();
