'use strict';

function makePanel (panel) {
  const p       =   {
    panel       :   {
      skip      :   0,
      limit     :   6
    },
    items       :   [],
    active      :   null
  };

  if ( typeof panel === 'object' ) {
    if ( panel.type ) {
      p.panel.type = panel.type;
    }

    if ( panel.parent ) {
      p.panel.parent = panel.parent;
    }
  }

  else if ( typeof panel === 'string' ) {
    const bits = panel.split('-');

    p.panel.type = { _id : bits[0] };

    if ( bits[1] ) {
      p.panel.parent = bits[1];
    }
  }

  return p;
}

export default makePanel;
