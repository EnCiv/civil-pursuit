'use strict';

import sequencer from 'sequencer';
import SynError from 'syn/../../dist/lib/app/error';

function get (name) {
  return sequencer.pipe(

    () => this.findOne({ name }),

    config => new Promise((ok, ko) => {
      config ? ok(config.value) : ko(
        new SynError(
          `No such config by the name of ${name}`,
          {},
          SynError.CONFIG_NOT_FOUND
        )
      );
    })

  );
}

export default get;
