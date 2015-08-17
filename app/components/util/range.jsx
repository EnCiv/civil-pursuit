'use strict';

import React from 'react';
import Input from './input';

class Range extends React.Component {
  render () {
    return (
      <Input { ...this.props } type="range" />
    );
  }
}

export default Range;
