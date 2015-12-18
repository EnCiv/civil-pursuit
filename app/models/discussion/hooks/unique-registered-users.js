'use strict';

function uniqueRegisteredUsers (discussion) {
  return new Promise((ok, ko) => {
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

export default uniqueRegisteredUsers;
