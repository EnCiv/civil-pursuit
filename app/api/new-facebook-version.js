'use strict';

import sequencer from 'promise-sequencer';
import User from '../models/user';
import encrypt from '../lib/util/encrypt';

function newFacebookVersion (user, cb) {
  sequencer(
    () => User.findOne({ email : user.email, __V : { $lt : 4 } }),
    () => encrypt(user.id + 'synapp')
  )
    .then(results => {
      const [ synuser, password ] = results;
      synuser.set({ password }).then(cb)
    });
}

export default newFacebookVersion;
