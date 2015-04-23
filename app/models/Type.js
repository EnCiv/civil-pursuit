! function () {
  
  'use strict';

  var mongoose        =     require('mongoose');

  var Schema          =     mongoose.Schema;

  var findRandom      =     require('mongoose-simple-random');

  var TypeSchema      =     new Schema({

    "name"        :     {
      type        :     String,
      unique      :     true
    },
    "harmony"     :     [{
      "name"      :     Schema.Types.ObjectId
    }],
    "parent"      :     Schema.Types.ObjectId

  });

  TypeSchema.plugin(findRandom);

  var Type = module.exports = mongoose.model('Type', TypeSchema);

} ();
