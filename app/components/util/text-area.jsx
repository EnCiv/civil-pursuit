'use strict';

import React from 'react';
import Input from './input'
import autosize from 'autosize';

const classes = [
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

class Textarea extends Input {
  
  componentDidMount () {
    autosize(this.inputRef);
  }

  render () {
    let classNames=this.props.className && this.props.className.split(' ') || [];
    const {className, onChange, value, style, defaultValue, ...textAreaProps}=this.props;

    for ( let prop of classes ) {
      if ( this.props[prop] ) {
        classNames.push(prop);
        delete textAreaProps[prop];
      }
    }

    return (
      <textarea className={ classNames.join(' ') } { ...textAreaProps } onChange={this.onChangeHandler} value={this.state.value} ref={this.getInputRef} style={this.winkStyle()}/>
    );
  }
}

export default Textarea;
