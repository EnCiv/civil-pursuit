'use strict';

import {Domain} from 'domain';

let run = (fn, catcher) => {
  let d = new Domain().on('error', error => catcher);

  d.run(() => {
    try { fn(d) } catch ( error ) { catcher(error) }
  });
};

run.next = (fn, catcher) => { process.nextTick(() => { run(fn, catcher) }) };

export default run;
