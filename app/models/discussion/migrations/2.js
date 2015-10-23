'use strict';

import fixtures from '../../../../fixtures/discussion/1.json';
import Mungo from 'mungo';
import User from '../../../models/user';

const collection = 'discussions';

class V2 {
  static schema () {
    return {
      "subject"       :   {
        "type"        :   String,
        "required"    :   true
      },
      "description"   :   {
        "type"        :   String,
        "required"    :   true
      },
      "deadline"      :   {
        "type"        :   Date,
        "required"    :   true
      },
      "goal"          :   {
        "type"        :   Number,
        "required"    :   true
      },
      "registered"    :   [{
        "type"        :   User,
        "required"    :   true
      }]
    };
  }

  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 }, { limit : false })
          .then(
            documents => {
              try {
                if ( documents.length ) {
                  return ok();
                }
                const discussion = fixtures[0];
                this
                  .create(discussion, { version : 2 })
                  .then(
                    created => {
                      try {
                        Mungo.Migration
                          .create({
                            collection,
                            version : 2,
                            created : [created._id]
                          })
                          .then(ok, ko);
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko
                  );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static undo () {
    return Mungo.Migration.undo(this, 2, collection);
  }
}

export default V2;
