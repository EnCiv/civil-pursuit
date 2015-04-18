! function () {
  
  'use strict';

  var mongoose    =   require('mongoose');

  var Schema      =   mongoose.Schema;

  var src         =   require(require('path').join(process.cwd(), 'src'));

  var config      =   src('config');

  module.exports = {

    /** Image URL */

    "image": {
      "type":       String
    },

    /** References */

    "references": [
      new Schema({
        "url":      String,
        "title":    String
      })
    ],

    /** Subject */

    "subject": {
      "type":       String,
      "required":   true
    },

    /** Description */
    
    "description": {
      "type":       String,
      "required":   true
    },

    /* Item type */

    "type": {
      "type":       String,
      "required":   true,
      "validate":   function (type) {
        return Object.keys(config.items).indexOf(type) > -1;
      }
    },

    // Parent item
    
    "parent": {
      "type":       Schema.Types.ObjectId,
      "ref":        "Item",
      "index":      true
    },

    // When created from another item

    "from": {
      "type":       Schema.Types.ObjectId,
      "ref":        "Item",
      "index":      true
    },

    // the user id (reference to User, required)
    
    "user": {
      "type":       Schema.Types.ObjectId,
      "ref":        "User",
      "required":   true,
      "index":      true
    },

    // The number of times Item has been promoted

    "promotions": {
      "type":       Number,
      "index":      true,
      "default"     :   0
    },

    // The number of times Item has been viewed

    "views":  {
      "type":       Number,
      "index":      true,
      "default"     :   0
    },

    // When Item was created

    "created": {
      "type":       Date,
      "default":    Date.now
    },

    // When Item was last edited

    "edited": {
      "type":       Date,
      "default":    Date.now
    }

  };

} ();
