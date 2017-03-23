'use strict';

import Type from '../../type';
import sequencer from 'promise-sequencer';

function countChildren () {
  if(this.subtype){
      return sequencer.pipe(

      () => new Promise((ok, ko) => {
        Type.findById(this.subtype).then(ok, ko);
      }),

      subtype => this.constructor.count({ parent : this, type : subtype })

    );
  }

  return sequencer.pipe(

    () => new Promise((ok, ko) => {
      if ( this.$populated.type ) {
        ok(this.$populated.type);
      }
      Type.findById(this.type).then(ok, ko);
    }),

    type => type.getSubtype(),

    subtype => this.constructor.count({ parent : this, type : subtype })

  );
}

export default countChildren;
