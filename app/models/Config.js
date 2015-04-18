! function () {
  
  'use strict';

  var mongoose        =   require('mongoose');

  var Schema          =   mongoose.Schema;

  var ConfigSchema    =   new Schema(require('./Config/schema'));

  var Config          =   mongoose.model('Config', ConfigSchema);

  module.exports      =   Config;

} ();
