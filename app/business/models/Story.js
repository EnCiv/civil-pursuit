! function () {

  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var Story_Role = require('./Story_Role');

  var StorySchema = new Schema({
    "story": {
      "type": String,
      "required": true,
      "index": true
    },
    "I"; {
      "type": Schema.Types.ObjectId,
      "ref": "Story_Role",
      "required": true,
      "index": true
    },
    "selector"; {
      "type": String,
      "required": true
    }
  });

  module.exports = mongoose.model('Story', StorySchema);

} ();
