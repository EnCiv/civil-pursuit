'use strict';

import Mung from 'mung';
import mongodb from 'mung/node_modules/mongodb';

const collection = 'users';

class V3 {
  static schema () {
    return {
      "email"             :     {
        "type"            :     String,
        "required"        :     true,
        "unique"          :     true
      },

      "password"          :     {
        "type"            :     String,
        "required"        :     true,
        "private"         :     true
      },

      "image"             :     String,

      "preferences"       :     [{
        "name"            :     String,
        "value"           :     Mung.Mixed
      }],

      "twitter"           :     String,

      "facebook"          :     String,

      "first_name"        :     String,

      "middle_name"       :     String,

      "last_name"         :     String,

      "gps"               :     {
        type              :     [Number],
        index             :     '2d'
      },

      "gps validated"     :     Date,

      "activation_key"    :     String,

      "activation_token"  :     String,

      "race"              :     [Race],

      "gender"            :     {
        "type"            :     String,
        "validate"        :     value => ['M', 'F', 'O'].indexOf(value) > -1
      },

      "married"           :     MaritalStatus,

      "employment"        :     Employment,

      "education"         :     Education,

      "citizenship"       :     [Country],

      "dob"               :     Date,

      "registered_voter"  :     Boolean,

      "party"             :     PoliticalParty,

      "city"              :     String,

      "state"             :     State,

      "zip"               :     String,

      "zip4"              :     String
    }
  }

  static do () {
    return new Promise((ok, ko) => {
      try {

        Mung.connections[0]
          .db.collection(collection)

          // citizenship should be an array, but sometimes it is an object, bug
          .find({ citizenship : { $type : 3 } })
          .limit(0)
          .toArray()
          .then(
            users => {
              try {
                if ( ! users.length ) {
                  return ok();
                }
                const updatedUsers = users.map(user => {
                  user.citizenship = Object.keys(user.citizenship).map(index => user.citizenship[index]);

                  return user;
                });

                const undo = users.map(user => ({
                  _id : user._id,
                  set : { citizenship : user.citizenship }
                }));

                this.create(users, { version : 3 })
                  .then(
                    () => {
                      try {
                        Mung.Migration
                          .create({
                            collection,
                            version : 3,
                            undo
                          })
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
    return Mung.Migration.undo(this, 3, collection);
  }
}

export default V3;
