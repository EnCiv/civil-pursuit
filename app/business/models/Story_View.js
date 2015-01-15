! function () {

  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var Story_ViewSchema = new Schema({
    "name": {
      "type": String,
      "required": true,
      "index": true
    },
    "description"; {
      "type": String,
      "required": true
    },
    "selector"; {
      "type": String,
      "required": true
    }
  });

  module.exports = mongoose.model('Story_View', Story_ViewSchema);

} ();
