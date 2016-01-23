'use strict';

import React                        from 'react';
import Column                       from './util/column';
import PromoteButton                from './promote-button';
import PromoteEditAndGoAgainButton  from './promote-edit-and-go-again-button';

class PromoteBigScreenButtons extends React.Component {

  next () {
    const { position, emitter } = this.props;

    emitter.emit('promote', position);
  }

  render () {

    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column
        span        =   "50"
        className   =   { `promote-${position} promote-item-${position}` }
        ref         =   "view"
        >

        <PromoteButton
          { ...item }
          onClick   =   { this.next.bind(this) }
          className =   "gutter-bottom promote-item-button"
          />

        <PromoteEditAndGoAgainButton
          { ...this.props }
          panel-id  =   { this.props['panel-id'] }
          item      =   { item }
          />

      </Column>
    );
  }
}

export default PromoteBigScreenButtons;
