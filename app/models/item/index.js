'use strict';

import S                                from 'string';
import Model                            from '../../lib/app/model';
import Is                               from '../../lib/util/is';
import User                             from '../user';
import Type                             from '../type';
import getPopularity                    from './methods/get-popularity';
import toPanelItem                      from './methods/to-panel-item';
import getLineage                       from './methods/get-lineage';
import countHarmony                     from './methods/count-harmony';
import countVotes                       from './methods/count-votes';
import countUpvote                      from './methods/count-upvote';
import countChildren                    from './methods/count-children';
import generateId                       from './hooks/set-id';
import evaluate                         from './statics/evaluate';
import getPanelItems                    from './statics/get-panel-items';
import getRandomItems                   from './statics/get-random-items';
import getDetails                       from './statics/get-details';
import getUrlTitle                      from './hooks/get-url-title';
import saveImage                        from './hooks/save-image';
import lambda                           from './statics/lambda';
import V2                               from './migrations/2';

class Item extends Model {

  static version = 2;

  static migrations = {
    2 : V2
  };

  static get schema () {
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
            "validate"    :   Is.url()
          },
          "title"         :   String
        }],
        "default"         :   []
      },

      "subject"           :   {
        "type"            :   String,
        "required"        :   true,
        "validate"        :   Is.lesserThan(255)
      },

      "description"       :   {
        "type"            :   String,
        "required"        :   true,
        "validate"        :   Is.lesserThan(5000)
      },

      "type"              :   {
        "type"            :   Type,
        "required"        :   true
      },

      "subtype"              :   {
        "type"            :   Type
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
      },

      "profiles"          :  {
        "type"            :   [String]
      },
      "new_location"      :  {
        "type"            :    String
      }
    };
  }

  static inserted () {
    return [
      this.emit.bind(this, 'created'),
      this.saveImage.bind(this),
      this.getUrlTitle.bind(this),
    ];
  }

  static inserting () {
    return [
      this.generateId.bind(this)
    ];
  }

  static updated () {
    return [
      this.emit.bind(this, 'updated')
    ];
  }

  static generateId (...args) {
    return generateId.apply(this, args);
  }

  static getPanelItems (...args) {
    return getPanelItems.apply(this, args);
  }

  static getRandomItems (...args) {
    return getPanelItems.apply(this, args);
  }

  static evaluate (...args) {
    return evaluate.apply(this, args);
  }

  static getDetails (...args) {
    return getDetails.apply(this, args);
  }

  static getUrlTitle (...args) {
    return getUrlTitle.apply(this, args);
  }

  static saveImage (...args) {
    return saveImage.apply(this, args);
  }

  static lambda (...args) {
    return lambda.apply(this, args);
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

  countUpvote (...args) {
    return countUpvote.apply(this, args);
  }
  countVotes (...args) {
    return countVotes.apply(this, args);
  }

  countChildren (...args) {
    return countChildren.apply(this, args);
  }

  get link () {
    return `/item/${this.id}/${this.slug}`;
  }

  get slug () {
    return S(this.subject).slugify().s;
  }
}

export default Item;
