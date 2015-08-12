'use strict';

import React from 'react';

class Select extends React.Component {
  render () {
    let classes = ['bp_input'];

    let props = ['block', 'small', 'medium', 'large'];

    for ( let prop of props ) {
      if ( this.props[prop] ) {
        classes.push(prop);
      }
    }

    return (
      <select type="{ this.props.type || 'text' }" className={ classes.join(' ') } { ...this.props }>
        { this.props.children }
      </select>
    );
  }
}

export default Select;
