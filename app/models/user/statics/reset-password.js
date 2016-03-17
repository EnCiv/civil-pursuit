'use strict';

import sequencer from 'promise-sequencer';
import encrypt from '../../../lib/util/encrypt';

function resetPassword (activation_key, activation_token, password) {
  return sequencer(
    ()    =>  encrypt(password),
    hash  =>  sequencer(
      ()      =>  this.findOne({ activation_key, activation_token }),
      user    =>  user
        .set({
          password          :   hash,
          activation_key    :   null,
          activation_token  :   null
        })
        .save()
    )
  );
}

export default resetPassword;
