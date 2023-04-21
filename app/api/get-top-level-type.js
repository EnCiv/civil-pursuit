'use strict';

import sequencer    from 'promise-sequencer';
import Type         from '../models/type';
import Config       from '../models/config';

function getTopLevelType (cb) {
  sequencer.pipe(
    () => Config.get('top level type'),

    type => Type.findById(type)
  )
  .then(type => cb(type && type.toJSON()))
  .catch(this.error.bind(this));
}

export default getTopLevelType;
