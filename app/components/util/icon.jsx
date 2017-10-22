'use strict';

import React from 'react';

class Icon extends React.Component {
  render () {
    let classes = ['fa'];
    let newProps=Object.assign({},this.props);

    if ( this.props.icon ) {
      classes.push(`fa-${this.props.icon}`);
      delete newProps.icon
    }

    if ( this.props.size ) {
      classes.push(`fa-${this.props.size}x`);
      delete newProps.size
    }

    if ( this.props.list ) {
      classes.push('fa-li');
      delete newProps.list
    }

    if ( this.props.spin ) {
      classes.push('fa-spin');
      delete newProps.spin
    }

    if ( this.props.className ) {
      for ( let cls of this.props.className.split(/\s+/) ) {
        classes.push(cls);
      }
    }

    if ( this.props.circle ) {
      classes.push('fa-stack-1x');
      delete newProps.circle;
      return (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle-o fa-stack-2x"></i>
          <i { ...newProps } className={ classes.join(' ') }></i>
        </span>
      );
    }

    else {
      return (
        <i { ...newProps } className={ classes.join(' ') }></i>
      );
    }
  }
}

export default Icon;
