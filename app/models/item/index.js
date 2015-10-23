'use strict';

import Mungo             from 'mungo';
import isUrl            from '../../lib/util/is/url';
import isLesserThan     from '../../lib/util/is/lesser-than';
import User             from '../user';
import Type             from '../type';
import getPopularity    from './methods/get-popularity';
import toPanelItem      from './methods/to-panel-item';
import getLineage       from './methods/get-lineage';
import countHarmony     from './methods/count-harmony';
import countVotes       from './methods/count-votes';
import countChildren    from './methods/count-children';
import generateId       from './statics/id';
import getPanelItems    from './statics/get-panel-items';
import V2               from './migrations/2';

class Item extends Mungo.Model {
  static schema () {
    return {
      "id"                :   {
        "type"            :   String,
        "unique"          :   true
      },

      "image"             :   {
        "type"            :   String
      },

      "references"        :   {
        "type"            :   [{
          "url"           :   {
            "type"        :   String,
            "validate"    :   isUrl
          },
          "title"         :   String
        }],
        "default"         :   []
      },

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

  countVotes (...args) {
    return countVotes.apply(this, args);
  }

  countChildren (...args) {
    return countChildren.apply(this, args);
  }

  static inserting () {
    return [
      this.generateId.bind(this)
    ];
  }

  static generateId (...args) {
    return generateId.apply(this, args);
  }

  static getPanelItems (...args) {
    return getPanelItems.apply(this, args);
  }
}

Item.migrations = {
  2 : V2
};

export default Item;
