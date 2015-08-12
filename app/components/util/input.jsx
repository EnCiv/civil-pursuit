'use strict';

import React from 'react';

class Input extends React.Component {
  render () {
    let classes = ['bp_input'];

    if ( this.props.block ) {
      classes.push('block');
    }

    if ( this.props.medium ) {
      classes.push('medium');
    }

    if ( this.props.large ) {
      classes.push('large');
    }

    return (
      <input type="{ this.props.type || 'text' }" className={ classes.join(' ') } { ...this.props }  />
    );
  }
}

export default Input;
