var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
  "email": {
      "type": String,
      "required": true,
      "index": {
        "unique": true
      }
    },
    "password": {
      "type": String,
      "required": true
    },
    "created": {
      "type": Date,
      "default": Date.now
    }
});

module.exports = schema;
