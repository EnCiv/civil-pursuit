'use strict';

import sequencer          from 'sequencer';
import calcHarmony        from '../../../lib/app/get-harmony';

function countHarmony () {
  return sequencer([

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
        ok(calcHarmony(...results));
      }
      catch ( error ) {
        ko(error);
      }
    })

  ]);
};

export default countHarmony;
