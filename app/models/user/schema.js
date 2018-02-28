'use strict';

import Mungo                            from 'mungo';
import Race                             from '../race';
import MaritalStatus                    from '../marital-status';
import Employment                       from '../employment';
import Education                        from '../education';
import PoliticalParty                   from '../political-party';
import PoliticalTendency                from '../political-tendency';
import Country                          from '../country';
import State                            from '../state';

class Schema extends Mungo.Model {
  static gender = ['M', 'F', 'O'];

  static get schema () {
    return {
      "email"             :     {
        "type"            :     String
      },

      "password"          :     {
        "type"            :     String,
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
        "validate"        :     value => this.gender.indexOf(value) > -1
      },

      "married"           :     MaritalStatus,

      "employment"        :     Employment,

      "education"         :     Education,

      "citizenship"       :     Country,

      "dualcitizenship"   :     Country,

      "dob"               :     Date,

      "registered_voter"  :     Boolean,

      "party"             :     PoliticalParty,

      "tendency"          :     PoliticalTendency,

      "city"              :     String,

      "state"             :     State,

      "zip"               :     String,

      "zip4"              :     String,

      "neighborhood"      :     String,

      "member_type"       :     String,

      "year_of_birth"     :     Number,

      "street_address"    :     Mungo.Mixed
    };
  }
}

export default Schema;
