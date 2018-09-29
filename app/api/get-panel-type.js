'use strict';

import Type         from '../models/type';

function getPanelType (shortTypeId, cb) {
    
  Type.findOne({ id : shortTypeId })
  .then(type => cb(type && type.toJSON()))
  .catch(this.error.bind(this));
}

export default getPanelType;
