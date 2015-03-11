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
    }],
    "education": [{
      "name": String
    }],
    "party": [{
      "name": String
    }]
  });

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
