'use strict';

import React from 'react';
import Input from './input';

class TextInput extends React.Component {
  render () {
    return (
      <Input { ...this.props } type="text" />
    );
  }
}

export default TextInput;
