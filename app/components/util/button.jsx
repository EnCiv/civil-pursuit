'use strict';

import React from 'react';

class Button extends React.Component {

  static propTypes    =   {
    block             :   React.PropTypes.bool,
    primary           :   React.PropTypes.bool,
    info              :   React.PropTypes.bool,
    large             :   React.PropTypes.bool,
    medium            :   React.PropTypes.bool,
    radius            :   React.PropTypes.bool,
    'cursor-pointer'  :   React.PropTypes.bool,
    shy               :   React.PropTypes.bool,
    success           :   React.PropTypes.bool,
    error             :   React.PropTypes.bool,
    warning           :   React.PropTypes.bool,
    small             :   React.PropTypes.bool
    inactive          :   React.PropTypes.bool,
  };

  render () {
    const classes = [this.props.className || ''];

    for ( let prop in this.constructor.propTypes ) {
      if ( this.props[prop] ) {
        classes.push(prop);
      }
    }

    return (
      <button { ...this.props } type={ this.props.type || "button" } className={ classes.join(' ') }>
        { this.props.children }
      </button>
    );
  }
}

export default Button;
