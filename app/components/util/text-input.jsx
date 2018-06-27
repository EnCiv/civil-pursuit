'use strict';

import React from 'react';
import Input from './input';

class TextInput extends React.Component {
  select(){
    return this.refs.view.select();
  }

  render () {
    return (
      <Input { ...this.props } type="text"  ref="view"/>
    );
  }
}

Object.defineProperty(TextInput.prototype,'value',{
  get: function () {
    return this.refs.view.value;
  },
  set: function (v) {
    this.refs.view.value=v;
  }
})

export default TextInput;
