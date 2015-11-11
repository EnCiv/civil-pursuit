'use strict';

function makeProps (options = {}) {
  const props = {
    close           :   false,
    created         :   {},
    env             :   options.env || 'development',
    intro           :   options.intro,
    instructions    :   [],
    item            :   options.item,
    items           :   {},
    newItem         :   null,
    online          :   0,
    panels          :   {},
    path            :   options.path || '/',
    ready           :   false,
    topLevelType    :   null,
    urlParams       :   {},
    user            :   null,
    userToReset     :   null,
  };

  if ( options.panel ) {
    props.panels = Object.assign(props.panels, options.panel);
  }

  return props;
}

export default makeProps;
