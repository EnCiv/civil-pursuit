'use strict';

import sequencer    from 'promise-sequencer';
import Type         from '../models/type';
import Config       from '../models/config';

function getPanelType (shortTypeId, cb) {
    
  Type.findOne({ id : shortTypeId })
  .then(type => cb(type.toJSON()))
  .catch(this.error.bind(this));
}

export default getPanelType;
