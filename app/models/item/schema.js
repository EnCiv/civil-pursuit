'use strict';

import { Schema }             from 'mongoose';
import isUrl                  from 'syn/lib/util/is/url';
import isLesserThan           from 'syn/lib/util/is/lesser-than';

try {
  require('syn/models/type');
  require('syn/models/user');
}
catch ( error ) {
  /** Already imported **/
}

let schema = {

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
    // "validate"        :   isCloudinaryUrl
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

    "type"            :   Schema.Types.ObjectId,
    "required"        :   true,
    "ref"             :   "Type"
  },

  "parent"            :   {

    "type"            :   Schema.Types.ObjectId,
    "ref"             :   "Item",
    "index"           :   true
  },

  // When created from another item

  "from"              :   {
    "type"            :   Schema.Types.ObjectId,
    "ref"             :   "Item",
    "index"           :   true
  },

  "user"              :   {
    "type"            :   Schema.Types.ObjectId,
    "ref"             :   "User",
    "required"        :   true,
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

export default schema;
