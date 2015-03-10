! function () {
  
  'use strict';

  var mongoose    =   require('mongoose');

  var Schema      =   mongoose.Schema;

  var src         =   require(require('path').join(process.cwd(), 'src'));

  src('models/Config');
  src('models/Country');

  module.exports = {

    /** email */

    "email": {        
      "type":             String,
      "required":         true,
      "index": {
        "unique":         true
      }
    },

    /** password **/
    
    "password": {
      "type":             String,
      "required":         true
    },

    /** created **/

    "created": {
      "type":             Date,
      "default":          Date.now
    },

    /** image url **/

    "image":            String,

    /** twitter ID if any **/

    "twitter":          String,

    /** Facebook ID if any **/

    "facebook":         String,

    /** first name **/

     "first_name":      String,

    /** middle name **/

     "middle_name":     String,

    /** last name **/

     "last_name":       String,

    /** gps location **/

    "gps": {
      "type":             [Number], // [<longitude>, <latitude>]
      "index":            '2d'
    },

    /** Date when GPS was validate **/

    "gps validated":    Date,

    // preferences

    "preferences": [
      new Schema({
        "name":         String,
        "value":        Schema.Types.Mixed
      })
    ],

    /** Activation key */

    "activation_key":   String,

    /** Activation URL */

    "activation_token":   String,

    /** Race **/

    "race": [{
      "type":         Schema.Types.ObjectId,
      "ref":          "Config.race"
    }],

    /** Marital status **/

    "married": {
      "type":         Schema.Types.ObjectId,
      "ref":          "Config.married"
    },

    /** Employment **/

    "employment": {
      "type":         Schema.Types.ObjectId,
      "ref":          "Config.employment"
    },

    /** Education **/

    "education": {
      "type":         Schema.Types.ObjectId,
      "ref":          "Config.education"
    },

    /** Citizenship **/

    "citizenship": [{
      "type":         Schema.Types.ObjectId,
      "ref":          "Country"
    }],

    /** DOB **/

    "dob": Date
  };

} ();
