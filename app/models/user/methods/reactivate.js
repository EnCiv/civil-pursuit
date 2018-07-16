'use strict';

import sequencer          from 'promise-sequencer';
import randomString from '../../../lib/util/random-string';

function reactivate () {
  return sequencer.pipe(
    ()        =>  Promise.all([randomString(12), randomString(12)]),
    results   =>  Promise.all([
      this.set({ activation_key : results[0] }).save(),
      this.set({ activation_token : results[0] }).save()
    ]),
    ()        =>  new Promise(ok => ok(this))
  );
}

export default reactivate;
