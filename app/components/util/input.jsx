'use strict';

import React from 'react';

class Input extends React.Component {
  render () {
    let classes = ['bp_input'];
    var inputProps=Object.assign({},this.props);

    if ( this.props.block ) {
      classes.push('block');
      delete inputProps.block;
    }

    if ( this.props.medium ) {
      classes.push('medium');
      delete inputProps.medium;
    }

    if ( this.props.large ) {
      classes.push('large');
      delete inputProps.large;
    }

    return (
      <input type="{ this.props.type || 'text' }" className={ classes.join(' ') } { ...inputProps }  />
    );
  }
}

export default Input;
