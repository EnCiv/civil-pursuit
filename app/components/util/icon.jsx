'use strict';

import React from 'react';

class Icon extends React.Component {
  render () {
    let classes = ['fa'];

    if ( this.props.icon ) {
      classes.push(`fa-${this.props.icon}`);
    }

    if ( this.props.size ) {
      classes.push(`fa-${this.props.size}x`);
    }

    if ( this.props.list ) {
      classes.push('fa-li');
    }

    if ( this.props.spin ) {
      classes.push('fa-spin');
    }

    if ( this.props.className ) {
      for ( let cls of this.props.className.split(/\s+/) ) {
        classes.push(cls);
      }
    }

    if ( this.props.circle ) {
      classes.push('fa-stack-1x');
      return (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle-o fa-stack-2x"></i>
          <i { ...this.props } className={ classes.join(' ') }></i>
        </span>
      );
    }

    else {
      return (
        <i { ...this.props } className={ classes.join(' ') }></i>
      );
    }
  }
}

export default Icon;
