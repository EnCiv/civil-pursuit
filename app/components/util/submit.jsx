'use strict';

import React from 'react';
import Button from './button';

class Submit extends React.Component {
  render () {
    return (
      <Button type="submit" { ...this.props }>
        { this.props.children }
      </Button>
    );
  }
}

export default Submit;
