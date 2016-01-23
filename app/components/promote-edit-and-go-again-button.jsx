'use strict';

import React from 'react';
import Button from './util/button';

class PromoteEditAndGoAgainButton extends React.Component {
  editAndGoAgain (e) {
    if ( this.props.items[this.props.item._id] ) {
      window.Dispatcher.emit('set active', this.props['panel-id'], `${this.props.item._id}-edit-and-go-again`);
    }
    else {
      window.Dispatcher.emit('get item', this.props.item._id);
    }
  }

  render () {
    return (
      <Button
        block
        { ...this.props }
        onClick   =   { this.editAndGoAgain.bind(this) }
        >
          <i>Edit and go again</i>

        </Button>
    );
  }
}

export default PromoteEditAndGoAgainButton;
