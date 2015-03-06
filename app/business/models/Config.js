! function () {
  
  'use strict';

  var mongoose        =   require('mongoose');

  var Schema          =   mongoose.Schema;

  var ConfigSchema    =   new Schema({
    "race": [{
      "name": String
    }],
    "married": [{
      "name": String
    }],
    "employment": [{
      "name": String
    }]
  });

  var Config          =   mongoose.model('Config', ConfigSchema);

  module.exports      =   Config;

} ();
