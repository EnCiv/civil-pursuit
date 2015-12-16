'use strict';

function makePanelId (panel = {}) {
  if ( ! panel.type ) {
    throw new Error('Missing type - can not make panel id');
  }

  let id = panel.type._id || panel.type;

  if ( panel.parent ) {
    id += `-${(panel.parent._id || panel.parent)}`;
  }

  return id.toString();
};

export default makePanelId;
