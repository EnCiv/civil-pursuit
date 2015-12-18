'use strict';

import Mungo                      from 'mungo';
import User                       from '../user';
import findCurrent                from './statics/find-current';
import V1                         from './migrations/1';
import V2                         from './migrations/2';
import register                   from './methods/register';
import goalReached                from './hooks/goal-reached';
import uniqueRegisteredUsers      from './hooks/unique-registered-users';
import deadlineOverdue            from './hooks/deadline-overdue';
import discussionNotStartedYet    from './hooks/discussion-not-started-yet';

class Discussion extends Mungo.Model {
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
      "starts"        :   {
        "type"        :   Date,
        "required"    :   true
      },
      "goal"          :   {
        "type"        :   Number,
        "required"    :   true
      },
      "registered"    :   {
        "type"        :   [User],
        "default"     :   []
      }
    };
  }

  static inserting () {
    return [
      this.goalReached.bind(this),
      this.uniqueRegisteredUsers.bind(this),
      this.deadlineOverdue.bind(this),
      this.discussionNotStartedYet.bind(this)
    ];
  }

  static updating () {
    return [
      this.goalReached.bind(this),
      this.uniqueRegisteredUsers.bind(this),
      this.deadlineOverdue.bind(this),
      this.discussionNotStartedYet.bind(this)
    ];
  }

  static findCurrent (...args) {
    return findCurrent.apply(this, args);
  }

  static goalReached (...args) {
    return goalReached.apply(this, args);
  }

  static uniqueRegisteredUsers (...args) {
    return uniqueRegisteredUsers.apply(this, args);
  }

  static deadlineOverdue (...args) {
    return deadlineOverdue.apply(this, args);
  }

  static discussionNotStartedYet (...args) {
    return discussionNotStartedYet.apply(this, args);
  }

  register (...args) {
    return register.apply(this, args);
  }
}

Discussion.version = 3;

Discussion.migrations = {
  1 : V1,
  2 : V2
};

export default Discussion;
