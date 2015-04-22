! function () {
  
  'use strict';

  var mongoose        =   require('mongoose');

  var findRandom      =   require('mongoose-simple-random');

  var Schema          =   mongoose.Schema;

  var CountrySchema   =   new Schema({ "name": String });

  CountrySchema.plugin(findRandom);

  module.exports = mongoose.model('Country', CountrySchema);

} ();
