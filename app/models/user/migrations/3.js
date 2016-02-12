'use strict';

import Mungo                      from 'mungo';
import sequencer                  from 'promise-sequencer';
import Race                       from 'syn/../../dist/models/race';
import MaritalStatus              from 'syn/../../dist/models/marital-status';
import Employment                 from 'syn/../../dist/models/employment';
import Education                  from 'syn/../../dist/models/education';
import PoliticalParty             from 'syn/../../dist/models/political-party';
import Country                    from 'syn/../../dist/models/country';
import State                      from 'syn/../../dist/models/state';

/** <<< MD
Transform citizenship as object to an array
===

Due to an untraced bug, `citizenship` sometimes got a list object instead of
 an array, ie `{ citizenship : { 0 : Country } }` instead of
 `{ citizenship : [Country] }`.

So we get documents that have their citizenship as on object
 and transform them into arrays.
MD
*/

class User extends Mungo.Migration {

  static version = 3;

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
      },

      "image"             :     String,

      "preferences"       :     [{
        "name"            :     String,
        "value"           :     Mungo.Mixed
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

      "race"              :     {
        "type"            :     [Race],
        "distinct"        :     true
      },

      "gender"            :     {
        "type"            :     String,
        "validate"        :     value => User.gender.indexOf(value) > -1
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
    };
  }

  static do () {
    return sequencer([

      () => this.find({ citizenship : { $type : 3 } }).limit(0),

      users => Promise.all(users.map(user => sequencer([

        () => user
          .set('citizenship', Object.keys(user.citizenship).map(index =>
            user.citizenship[index]
          ))
          .save()

      ])))


    ]);
  }
}

export default User;
