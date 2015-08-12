'use strict';

import React from 'react';

class Textarea extends React.Component {
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
      <textarea className={ classes.join(' ') } { ...this.props }>{ this.props.children }</textarea>
    );
  }
}

export default Textarea;
