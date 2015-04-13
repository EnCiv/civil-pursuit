! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var mongoose        =   require('mongoose');

  var Schema          =   mongoose.Schema;

  var ConfigSchema    =   new Schema(src('models/Config/schema'));

  var Config          =   mongoose.model('Config', ConfigSchema);

  module.exports      =   Config;

  // mongoose.connect(process.env.MONGOHQ_URL);

  // Config.findOne(function (error, config) {

  //   config.party = [];

  //   require('./Config/party.json').forEach(function (party) {
  //     config.party.push(party);
  //   });

  //   config.save();
  // });

} ();
