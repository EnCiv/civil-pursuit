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
    "description": {
      "type": String,
      "required": true
    },
    "badge": [{
      "email": {
        "type": String
      },
      "password": {
        "type": String
      }
    }]
  });

  module.exports = mongoose.model('Story_Role', Story_RoleSchema);

} ();
