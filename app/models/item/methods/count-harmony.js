'use strict';

import sequencer          from 'promise-sequencer';
import calcHarmony        from '../../../lib/app/get-harmony';

function countHarmony () {
  return sequencer.pipe(

    // populate type if not $populated

    () => new Promise((ok, ko) => {
      try {
        if ( this.$populated.type ) {
          return ok();
        }

        this.populate('type').then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    }),

    // populate harmony

    () => new Promise((ok, ko) => {
      if ( this.$populated.type.$populated.harmony ) {
        return ok();
      }

      this.$populated.type.populate().then(ok, ko);

    }),

    // count harmony

    () => Promise.all(
      (this.$populated.type.harmony || []).map(side => new Promise((ok, ko) => {

        try {
          if ( side ) {
            this
              .constructor
              .count({
                parent    :   this,
                type      :   side
              })
              .then(ok, ko);
          }
          else {
            ok(0);
          }
        }
        catch ( error ) {
          ko(error);
        }
      }))
    ),

    results => new Promise((ok, ko) => {
      try {

        ok({
          harmony : calcHarmony(...results),
          pro : results[0],
          con : results[1],
          types : this.$populated.type.$populated.harmony
        });
      }
      catch ( error ) {
        ko(error);
      }
    })

  );
};

export default countHarmony;
