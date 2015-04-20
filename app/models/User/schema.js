! function () {
  
  'use strict';

  var schema;

  try {
    require('syn/models/Config');
    require('syn/models/Country');
  }
  catch ( error ) { /** Already imported **/ }

  var deps = [
    'mongoose',
    'syn/lib/util/is/cloudinary-url'
  ];

  deps = deps.map(function (dep) {
    return require(dep);
  });

  function run (mongoose, isCloudinaryUrl) {
    schema = {

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
        new mongoose.Schema({
          "name"          :   String,
          "value"         :   mongoose.Schema.Types.Mixed
        })
      ],

      /** Activation key */

      "activation_key"    :   String,

      /** Activation URL */

      "activation_token"  :   String,

      /** Race **/

      "race"              :   [{

        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "Config.race"
      }],

      /** Marital status **/

      "married"           :   {

        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "Config.married"
      },

      /** Employment **/

      "employment"        :   {

        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "Config.employment"
      },

      /** Education **/

      "education"         :   {

        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "Config.education"
      },

      /** Citizenship **/

      "citizenship"       :   [{

        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "Country"
      }],

      "dob"               :   Date,

      "gender"            :   String, /** M for male, F for female */

      "registered_voter"  :   Boolean,

      /** Political party **/

      "party"             :   {
        
        "type"            :    mongoose.Schema.Types.ObjectId,
        "ref"             :    "Config.party"
      }
    };
  }

  run.apply(null, deps);

  module.exports = schema;

} ();
