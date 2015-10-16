'use strict';

import Mung             from '../../lib/mung';
import isUrl            from '../../lib/util/is/url';
import isLesserThan     from '../../lib/util/is/lesser-than';
import User             from '../user';
import Type             from '../type';
import getPopularity    from './methods/get-popularity';
import toPanelItem      from './methods/to-panel-item';
import getLineage       from './methods/get-lineage';
import countHarmony     from './methods/count-harmony';
import generateId       from './statics/id';

class Item extends Mung.Model {
  static schema () {
    return {
      "id"                :   {
        "type"            :   String,
        "unique"          :   true
      },

      "image"             :   {
        "type"            :   String
      },

      "references"        :   [{
        "url"             :   {
          "type"          :   String,
          "validate"      :   isUrl
        },
        "title"           :   String
      }],

      "subject"           :   {
        "type"            :   String,
        "required"        :   true,
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
        "type"            :   this,
        "index"           :   true
      },

      // When created from another item

      "from"              :   {
        "type"            :   this,
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

  toPanelItem (...args) {
    return toPanelItem.apply(this, args);
  }

  getPopularity (...args) {
    return getPopularity.apply(this, args);
  }

  getLineage (...args) {
    return getLineage.apply(this, args);
  }

  countHarmony (...args) {
    return countHarmony.apply(this, args);
  }

  static inserting () {
    return [
      this.generateId.bind(this)
    ];
  }

  static generateId (...args) {
    return generateId.apply(this, args);
  }
}

export default Item;
