'use strict';

import React from 'react';
import Input from './input';

class DateInput extends React.Component {
  render () {
    return (
      <Input { ...this.props } type="date" />
    );
  }
}

export default DateInput;
