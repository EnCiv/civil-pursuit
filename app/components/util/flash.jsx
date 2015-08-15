'use strict';

import React              from 'react';

class Flash extends React.Component {
  render () {
    let classes = ['syn-flash'];

    if ( this.props.error ) {
      classes.push('syn-flash--error');
    }

    if ( this.props.success ) {
      classes.push('syn-flash--success');
    }

    if ( this.props.info ) {
      classes.push('syn-flash--info');
    }

    return (
      <div className={ classes.join(' ') }>
        { this.props.message }
      </div>
    );
  }
}

export default Flash;
