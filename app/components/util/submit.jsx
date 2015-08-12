'use strict';

import React from 'react';
import Button from './button';

class Submit extends React.Component {
  render () {
    return (
      <Button type="submit" primary { ...this.props }>
        { this.props.children }
      </Button>
    );
  }
}

export default Submit;
