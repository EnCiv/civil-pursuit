'use strict';

import { Schema } from 'mongoose';

import isCloudinaryUrl from '../../lib/util/is/cloudinary-url';

try {
  require('../../config');
  require('../../country');
}
catch ( error ) { /** Already imported **/ }

let schema = {

    "email"             :     {

      "type"            :     String,
      "required"        :     true,
      "index"           :     {
        "unique"        :     true
      }
    },
    
    "password"          :     {

      "type"            :     String,
      "required"        :     true
    },

    "image"             :     {
      
      "type"            :     String,
      "validate"        :     isCloudinaryUrl
    },

    /** twitter ID if any **/

    "twitter"           :     String,

    /** Facebook ID if any **/

    "facebook"          :     String,

    "first_name"        :     String,

    "middle_name"       :     String,

    "last_name"         :     String,

    /** gps location **/

    "gps"               :     {

      "type"            :     [Number], // [<longitude>, <latitude>]
      "index"           :     '2d'
    },

    /** Date when GPS was validate **/

    "gps validated"     :    Date,

    // preferences

    "preferences"       :   [
      new Schema({
        "name"          :   String,
        "value"         :   Schema.Types.Mixed
      })
    ],

    /** Activation key */

    "activation_key"    :   String,

    /** Activation URL */

    "activation_token"  :   String,

    /** Race **/

    "race"              :   [{

      "type"            :   Schema.Types.ObjectId,
      "ref"             :   "Config.race"
    }],

    /** Marital status **/

    "married"           :   {

      "type"            :   Schema.Types.ObjectId,
      "ref"             :   "Config.married"
    },

    /** Employment **/

    "employment"        :   {

      "type"            :   Schema.Types.ObjectId,
      "ref"             :   "Config.employment"
    },

    /** Education **/

    "education"         :   {

      "type"            :   Schema.Types.ObjectId,
      "ref"             :   "Config.education"
    },

    /** Citizenship **/

    "citizenship"       :   [{

      "type"            :   Schema.Types.ObjectId,
      "ref"             :   "Country"
    }],

    "dob"               :   Date,

    "gender"            :   String, /** M for male, F for female */

    "registered_voter"  :   Boolean,

    /** Political party **/

    "party"             :   {
      
      "type"            :    Schema.Types.ObjectId,
      "ref"             :    "Config.party"
    }
  };

export default schema;
