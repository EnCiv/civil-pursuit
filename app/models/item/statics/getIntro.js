'use strict';

import sequencer from 'promise-sequencer';
import Type from '../../type';

function getIntro () {
  return sequencer.pipe(
    () => Type.findOne({ name : 'Intro' }),

    type => new Promise((pass, fail) => {
      if ( ! type ) {
        return fail(new Error('Intro type not found'));
      }

      sequencer.pipe(
        () => this.findOne({ type }),

        intro => new Promise((pass, fail) => {
          if ( ! intro ) {
            return fail(new Error('Intro item not found'));
          }
          intro.toPanelItem().then(pass, fail);
        })
      )
      .then(pass, fail);
    })
  );
}

export default getIntro;
