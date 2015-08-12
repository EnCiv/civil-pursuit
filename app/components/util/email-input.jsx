'use strict';

import React from 'react';
import Input from './input';

class EmailInput extends React.Component {
  render () {
    return (
      <Input { ...this.props } type="email" />
    );
  }
}

export default EmailInput;
