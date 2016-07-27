'use strict';

import config from '../../../public.json';

function makePanel (panel) {
  const p       =   {
    panel       :   {
      skip      :   0,
      limit     :   config['navigator batch size'],
      items     :   []
    },
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

  if ( ! p.panel.type ) {
    throw new Error('Could not determine panel type');
  }


  return p;
}

export default makePanel;
