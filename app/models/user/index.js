'use strict';

import Mungo                            from 'mungo';
import Race                             from '../race';
import MaritalStatus                    from '../marital-status';
import Employment                       from '../employment';
import Education                        from '../education';
import PoliticalParty                   from '../political-party';
import Country                          from '../country';
import State                            from '../state';
import validateGPS                      from './hooks/validate-gps';
import encryptPassword                  from './statics/encrypt-password';
import lowerEmail                       from './statics/lower-email';
import identify                         from './statics/identify';
import isPasswordValid                  from './statics/is-password-valid';
import saveImage                        from './statics/save-image';
import resetPassword                    from './statics/reset-password';
import lambda                           from './statics/lambda';
import reactivate                       from './methods/reactivate';
import addRace                          from './methods/add-race';
import removeRace                       from './methods/remove-race';
import setCitizenship                   from './methods/set-citizenship';
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
    }
  }

  static inserting () {
    return [
      this.encryptPassword.bind(this),
      this.lowerEmail.bind(this)
    ];
  }

  static updating () {
    return [
      this.validateGPS.bind(this)
    ];
  }

  static saveImage (...args) {
    return saveImage.apply(this, args);
  }

  static validateGPS (...args) {
    return validateGPS.apply(this, args);
  }

  static resetPassword (...args) {
    return resetPassword.apply(this, args);
  }

  static lambda (...args) {
    return lambda.apply(this, args);
  }

  reactivate (...args) {
    return reactivate.apply(this, args);
  }

  addRace (...args) {
    return addRace.apply(this, args);
  }

  removeRace (...args) {
    return removeRace.apply(this, args);
  }

  setCitizenship (...args) {
    return setCitizenship.apply(this, args);
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

User.gender = ['M', 'F', 'O'];

export default User;
