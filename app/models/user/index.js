'use strict';

import UserStatic           from './static';
import reactivate           from './methods/reactivate';
import addRace              from './methods/add-race';
import removeRace           from './methods/remove-race';
import setCitizenship       from './methods/set-citizenship';

class User extends UserStatic {

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

export default User;
