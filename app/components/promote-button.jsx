'use strict';

import React from 'react';
import Button from './util/button';

class PromoteButton extends React.Component {
  static propTypes = {
    subject : React.PropTypes.string
  }

  render () {
    return (
      <Button block { ...this.props }>{ this.props.subject }</Button>
    );
  }
}

export default PromoteButton;
