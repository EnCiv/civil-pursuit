'use strict';

import React from 'react';
import autosize from 'autosize';

class Textarea extends React.Component {
  componentDidMount () {
    const view = this.refs.view;
    autosize(view);
  }

  render () {
    let classes = [];
    let textAreaProps=Object.assign({},this.props);

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
        delete textAreaProps[prop];
      }
    }

    return (
      <textarea className={ classes.join(' ') } { ...textAreaProps } ref="view">{ this.props.children }</textarea>
    );
  }
}

Object.defineProperty(Textarea.prototype,'value',{
  get: function () {
    return this.refs.view.value;
  },
  set: function (v) {
    this.refs.view.value=v;
  }
})

export default Textarea;
