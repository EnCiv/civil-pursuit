'use strict';

import Mungo                             from 'mungo';
import Race                             from '../race';
import MaritalStatus                    from '../marital-status';
import Employment                       from '../employment';
import Education                        from '../education';
import PoliticalParty                   from '../political-party';
import Country                          from '../country';
import State                            from '../state';
import encryptPassword                  from './statics/encrypt-password';
import lowerEmail                       from './statics/lower-email';
import identify                         from './statics/identify';
import isPasswordValid                  from './statics/is-password-valid';
import saveImage                        from './statics/save-image';
import reactivate                       from './methods/reactivate';
import addRace                          from './methods/add-race';
import V2                               from './migrations/2';
import V3                               from './migrations/3';


class User extends Mungo.Model {
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

  static inserting () {
    return [
      this.encryptPassword.bind(this),
      this.lowerEmail.bind(this)
    ];
  }

  reactivate (...args) {
    return reactivate.apply(this, args);
  }

  addRace (...args) {
    return addRace.apply(this, args);
  }

  static saveImage (...args) {
    return saveImage.apply(this, args);
  }
}

User.encryptPassword          =     encryptPassword.bind(User);
User.lowerEmail               =     lowerEmail.bind(User);
User.identify                 =     identify.bind(User);
User.isPasswordValid          =     isPasswordValid.bind(User);

User.version = 3;

User.migrations = {
  2 : V2,
  3 : V3
};

export default User;
