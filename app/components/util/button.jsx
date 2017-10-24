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
    chosen             :   React.PropTypes.bool,
    success           :   React.PropTypes.bool,
    error             :   React.PropTypes.bool,
    warning           :   React.PropTypes.bool,
    small             :   React.PropTypes.bool,
    inactive          :   React.PropTypes.bool
  };

  static buttonInactive(e){
    e.stopPropagation();
  }

  render () {
    const classes = [this.props.className || ''];
    var buttonProps=Object.assign({},this.props);

    for ( let prop in this.constructor.propTypes ) {
      if ( this.props[prop] ) {
        classes.push(prop);
        delete buttonProps[prop];
      }
    }

    return (
      <button { ...buttonProps } onClick={this.props.inactive ? Button.buttonInactive : this.props.onClick } type={ this.props.type || "button" } className={ classes.join(' ') }>
        { this.props.children }
      </button>
    );
  }
}

export default Button;
