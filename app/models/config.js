! function () {
  
  'use strict';

  var mongoose        =   require('mongoose');

  var findRandom      =   require('mongoose-simple-random');

  var Schema          =   mongoose.Schema;

  var ConfigSchema    =   new Schema(require('./Config/schema'));

  ConfigSchema.plugin(findRandom);

  var Config          =   mongoose.model('Config', ConfigSchema);

  module.exports      =   Config;

} ();
