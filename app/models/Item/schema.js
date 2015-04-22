! function () {
  
  'use strict';

  var schema;

  try {
    require('syn/models/Type');
    require('syn/models/User');
  }
  catch ( error ) { /** Already imported **/ }

  var deps = [
    'mongoose',
    'syn/config.json',
    'syn/lib/util/is/cloudinary-url',
    'syn/lib/util/is/url',
    'syn/lib/util/is/lesser-than'
  ];

  deps = deps.map(function (dep) {
    return require(dep);
  });

  function run (mongoose, config, isCloudinaryUrl, isUrl, isLesserThan) {

    schema = {

      "id"                :   {

        "type"            :   String,
        "len"             :   5,
        // "required"        :   true,
        "index"           :   {
          "unique"        :   true
        }
      },

      "image"             :   {

        "type"            :   String,
        "validate"        :   isCloudinaryUrl
      },

      "references"        :   [{

          "url"           :   {

            "type"        :   String,
            "validate"    :   isUrl
          },
          
          "title"         :   String
        }
      ],

      "subject"           :   {

        "type"            :   String,
        // "required"        :   true,
        "validate"        :   isLesserThan(255)
      },

      "description"       :   {

        "type"            :   String,
        "required"        :   true,
        "validate"        :   isLesserThan(5000)
      },

      "type"              :   {

        "type"            :   mongoose.Schema.Types.ObjectId,
        "required"        :   true,
        "ref"             :   "Type"
      },

      "parent"            :   {

        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "Item",
        "index"           :   true
      },

      // When created from another item

      "from"              :   {
        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "Item",
        "index"           :   true
      },

      "user"              :   {
        "type"            :   mongoose.Schema.Types.ObjectId,
        "ref"             :   "User",
        // "required"        :   true,
        "index"           :   true
      },

      // The number of times Item has been promoted

      "promotions"        :   {

        "type"            :   Number,
        "index"           :   true,
        "default"         :   0
      },

      // The number of times Item has been viewed

      "views"             :   {
        
        "type"            :   Number,
        "index"           :   true,
        "default"         :   0
      }

    };
  }

  run.apply(null, deps);

  module.exports = schema;
} ();
