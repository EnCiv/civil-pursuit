'use strict';

import defaultUser    from 'syn/../../fixtures/user/1.json';
import encrypt        from 'syn/../../dist/lib/util/encrypt';
import Mungo          from 'mungo';
import sequencer      from 'sequencer';

/** <<< MD
Create default user
===
MD
*/

class User extends Mungo.Migration {

  static version = 2;

  static get schema () {
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
      }
    }
  }

  static inserting () {
    return [
      this.encryptPassword.bind(this),
      this.lowerEmail.bind(this)
    ];
  }

  static encryptPassword (doc) {
    return new Promise((ok, ko) => {
      try {
        encrypt(doc.password).then(
          hash => {
            try {
              doc.set('password', hash);
              ok();
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

  static lowerEmail (doc) {
    return new Promise((ok, ko) => {
      try {
        doc.set('email', doc.email.toLowerCase());
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static do () {
    return sequencer([

      () => this.findOne({ email : defaultUser.email }),

      user => new Promise((ok, ko) => {
        if ( user ) {
          return ok();
        }

        sequencer
          ([

            ()    =>  this.create(defaultUser),

            user  =>  this.revert({ remove : { _id : user._id } })

          ])

          .then(ok)

          .catch(error => {
            if ( error.code === 11000 ) {
              // means item has already called this
              ok();
            }
            else {
              ko(error);
            }
          });
      })
    ]);
  }
}

export default User;
