'use strict';

import Mung from '../../lib/mung';
import User from '../user';
import Type from '../type';

class Item extends Mung.Model {
  static schema () {
    return {
      "id"                :   {

        "type"            :   String,
        "len"             :   5,
        "unique"          :   true
      },

      "image"             :   {

        "type"            :   String
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

        "type"            :   Type,
        "required"        :   true
      },

      "parent"            :   {

        "type"            :   Item,
        "index"           :   true
      },

      // When created from another item

      "from"              :   {
        "type"            :   Item,
        "index"           :   true
      },

      "user"              :   {
        "type"            :   User,
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
  }
}

export default Item;
