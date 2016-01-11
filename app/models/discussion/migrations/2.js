'use strict';

import firstDiscussion        from 'syn/../../fixtures/discussion/1.json';
import Mungo                  from 'mungo';
import User                   from 'syn/../../dist/models/user';
import sequencer              from 'sequencer';

/** <<<MD
Import data from fixtures to DB
===

    fixtures = [{ name : String }]

Insert `fixtures` into model's collection
MD ***/

class Discussion extends Mungo.Migration {

  static version = 2

  static get schema () {
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
      "starts"        :   {
        "type"        :   Date,
        "required"    :   true
      },
      "goal"          :   {
        "type"        :   Number,
        "required"    :   true
      },
      "registerd"     :   {
        "type"        :   [User],
        "default"     :   []
      }
    };
  }

  static inserting () {
    return [
      this.uniqueRegisteredUsers.bind(this)
    ];
  }

  static updating () {
    return [
      this.uniqueRegisteredUsers.bind(this)
    ];
  }

  static uniqueRegisteredUsers (discussion)  {
    return new Promise((ok, ko) => {

      if ( ! discussion.registered ) {
        return ok();
      }

      const users = [];

      try {
        discussion.registered.forEach(user => {
          if ( users.indexOf(user.toString()) === -1 ) {
            users.push(user.toString());
          }
          else {
            throw new Error('User already registered');
          }
        });
      }
      catch ( error ) {
        return ko(error);
      }

      ok();
    });
  }

  static do () {
    return sequencer([

      // See if collection is empty

      () => this.count(),

      count => new Promise((ok, ko) => {
        // Not empty -- exit

        if ( count ) {
          return ok();
        }

        sequencer

          ([

            // insert first discussion

            () => this.create(firstDiscussion),

            doc => this.revert({ remove : { _id : doc._id } })

          ])

          .then(ok, ko);

      })

    ]);
  }
}

export default Discussion;
