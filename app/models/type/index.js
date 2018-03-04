'use strict';

import Mungo                            from 'mungo';
import isHarmony                        from './methods/is-harmony';
import getSubtype                       from './methods/get-subtype';
import getOpposite                      from './methods/get-opposite';
import group                            from './statics/group';
import generateId                       from './hooks/set-id';
import V1                               from './migrations/1';
import V2                               from './migrations/2';
import V3                               from './migrations/3';
import V4                               from './migrations/4';
import V5                               from './migrations/5';
import V6                               from './migrations/6';
import V7                               from './migrations/7';

class Type extends Mungo.Model {

  static version = 7;

  static migrations = {
    1 : V1,
    2 : V2,
    3 : V3,
    4 : V4,
    5 : V5,
    6 : V6,
    7 : V7
  };

  static get schema () {
    return {
      "name"        :     String,

      "harmony"     :     {
        type        :     [Type],
        default     :     []
      },

      "parent"      :     Type,

      "id"          :     {
        type        :     String,
        unique      :     true,
        required    :     true
      },
      "createMethod":     String,
      "promoteMethod":    String,
      "promoteButtonLabel" : {
        "inactive"   :     String,
        "active"     :     String
      },
      "feedbackMethod":     String,
      "visualMethod":     String,
      "evaluateQuestion" :  String,
      "instruction"      :  String,
      "component"        : Mungo.Mixed,
      "min"              : Number,
      "buttonName"       : String,
      "buttonTitle" : {
        "inactive"   :     String,
        "active"     :     String
      },
      "mediaMethod":       String,
      "referenceMethod":   String,
      "subjectPlaceholder": String,
      "buttons": Mungo.Mixed,
    }
  }

  static inserting () {
    return [
      this.generateId.bind(this)
    ];
  }

  static group (...args) {
    return group.apply(this, args);
  }

  static generateId (...args) {
    return generateId.apply(this, args);
  }

  isHarmony (...args) {
    return isHarmony.apply(this, args);
  }

  getSubtype (...args) {
    return getSubtype.apply(this, args);
  }

  getOpposite (...args) {
    return getOpposite.apply(this, args);
  }
}

export default Type;
