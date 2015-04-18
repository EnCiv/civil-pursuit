! function () {
  
  'use strict';

  var mongoose        =   require('mongoose');

  var Schema          =   mongoose.Schema;

  var CountrySchema   =   new Schema({ "name": String });

  module.exports = mongoose.model('Country', CountrySchema);

} ();
