! function () {
  
  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  module.exports = {

    "image": {
      "type": String
    },  

    "references": [
      new Schema({
        "url": String,
        "title": String
      })
    ],

    "subject": {
      "type": String,
      "required": true
    },
    
    "description": {
      "type": String,
      "required": true
    },

    // Item type

    "type": {
      "type": String,
      "required": true,
      "validate": function (type) {
        return ['Topic', 'Problem', 'Solution', 'Agree', 'Disagree', 'Pro', 'Con', 'Persona']
          .indexOf(type) > -1;
      }
    },

    // Parent item
    
    "parent": {
      "type": Schema.Types.ObjectId,
      "ref": "Item",
      "index": true
    },

    // When created from another item

    "from": {
      "type": Schema.Types.ObjectId,
      "ref": "Item",
      "index": true
    },

    // the user id (reference to User, required)
    
    "user": {
      "type": Schema.Types.ObjectId,
      "ref": "User",
      "required": true,
      "index": true
    },

    // The number of times Item has been promoted

    "promotions": {
      "type": Number,
      "index": true
    },

    // The number of times Item has been viewed

    "views":  {
      "type": Number,
      "index": true
    },

    // When Item was created

    "created": {
      "type": Date
    },

    // When Item was last edited

    "edited": {
      "type": Date,
      "default": Date.now
    }

  };

} ();
