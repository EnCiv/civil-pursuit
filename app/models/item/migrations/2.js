'use strict';

import Mungo          from 'mungo';
import sequencer      from 'promise-sequencer';
import Type           from 'syn/../../dist/models/type';
import User           from 'syn/../../dist/models/user';
import introItem      from 'syn/../../fixtures/item/1.json';
import systemUser     from 'syn/../../fixtures/user/1.json';
import collectionId   from 'syn/../../dist/lib/app/collection-id';
import Is             from 'syn/../../dist/lib/util/is';

/** <<< MD
Create Intro Item
===


MD
*/

class Item extends Mungo.Migration {

  static version = 2;

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

  static inserting () {
    return [this.generateId.bind(this)];
  }

  static generateId (item) {
    return new Promise((ok, ko) => {
      try {
        collectionId(this)
          .then(
            id => {
              item.set('id', id);
              ok();
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static do () {

    return sequencer([

      // Make sure we have a default user

      () => User.migrate(1),

      // Make sure we have Intro type

      () => Type.migrate(1, 2),

      // Get default user and Intro type

      () => Promise.all([
        User.findOne({ email : systemUser.email }),
        Type.findOne({ name : 'Intro' })
      ]),

      // Create intro item

      results => this.create(Object.assign(
        introItem,
        { user : results[0] },
        { type : results[1] }
      )),

      // Save in migrations

      item => this.revert({ remove : { _id : item._id } })
    ]);
  }
}

export default Item;
