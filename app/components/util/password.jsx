'use strict';

import React from 'react';
import Input from './input';

class Password extends React.Component {
  render () {
    return (
      <Input { ...this.props } type="password" />
    );
  }
}

export default Password;
