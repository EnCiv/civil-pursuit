'use strict';

import Mungo from 'mungo';
import Item from '../../item';
import User from '../../user';

const collection = 'feedback';

class V1 {
  static schema () {
    return {
      "item"          :  {
        type          :  Item,
        required      :  true
      },
      "user"          :  {
        type          :  User,
        required      :  true
      },
      "feedback"      :  {
        type          :  String,
        required      :  true
      },
      "created"       :  {
        "type"        :  Date,
        "default"     :  Date.now
      }
    };
  }

  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 1 }).then(
          documents => {
            try {
              if ( documents.length ) {
                return ok();
              }
              Mungo.connections[0].db
                .collection('feedbacks')
                .find()
                .toArray()
                .then(
                  feedbacks => {
                    this.create(feedbacks).then(
                      created => {
                        try {
                          Mungo.Migration
                            .create({
                              collection,
                              version : 1,
                              created : created.map(doc => doc._id)
                            })
                            .then(ok, ko);
                        }
                        catch ( error ) {
                          ko(error);
                        }
                      },
                      ko
                    );
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
    return Mungo.Migration.undo(this, 1, collection);
  }
}

export default V1;
