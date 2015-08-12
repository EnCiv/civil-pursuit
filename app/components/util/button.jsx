'use strict';

import React from 'react';

class Button extends React.Component {
  render () {

    let classes = [];

    let props = [
      'block',
      'primary',
      'info',
      'large',
      'medium',
      'radius',
      'cursor-pointer',
      'shy',
      'success',
      'error',
      'warning'
    ];

    for ( let prop of props ) {
      if ( this.props[prop] ) {
        classes.push(prop);
      }
    }

    return (
      <button type="button" { ...this.props } className={ classes.join(' ') }>
        { this.props.children }
      </button>
    );
  }
}

export default Button;
