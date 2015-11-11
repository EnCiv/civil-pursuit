'use strict';

function makePanelId (panel) {
  let id = panel.type._id || panel.type;

  if ( panel.parent ) {
    id += `-${(panel.parent._id || panel.parent)}`;
  }

  // else if ( panel.item && ! panel.backEnd ) {
  //   id += `-${panel.item._id}`;
  // }

  return id;
};

export default makePanelId;
