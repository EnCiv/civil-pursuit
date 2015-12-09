'use strict';

function makePanelId (panel) {
  let id = panel.type._id || panel.type;

  if ( panel.parent ) {
    id += `-${(panel.parent._id || panel.parent)}`;
  }

  return id;
};

export default makePanelId;
