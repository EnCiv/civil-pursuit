! function () {

  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var Story_RoleSchema = new Schema({
    "name": {
      "type": String,
      "required": true,
      "index": true
    },
    "events": [{
      "name": {
        "type": String,
        "required": true
      },
      "description": {
        "type": String
      }
    }]
  });

  module.exports = mongoose.model('Story_Role', Story_RoleSchema);

} ();
