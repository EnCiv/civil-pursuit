'use strict';

import React from 'react';
import autosize from 'autosize';

class Textarea extends React.Component {
  componentDidMount () {
    const view = React.findDOMNode(this.refs.view);
    autosize(view);
  }

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
      <textarea className={ classes.join(' ') } { ...this.props } ref="view">{ this.props.children }</textarea>
    );
  }
}

export default Textarea;
