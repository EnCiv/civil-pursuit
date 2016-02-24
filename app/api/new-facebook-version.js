'use strict';

import sequencer from 'promise-sequencer';
import User from '../models/user';

function newFacebookVersion (user, cb) {
  sequencer.pipe(
    () => User.findOne({ email : user.email, __V : { $lt : 4 } }),
    user => user.set('password', user.id + 'synapp').save()
  ).then(cb);
}

export default newFacebookVersion;
