'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component {

  static propTypes    =   {
    block             :   PropTypes.bool,
    primary           :   PropTypes.bool,
    info              :   PropTypes.bool,
    large             :   PropTypes.bool,
    medium            :   PropTypes.bool,
    radius            :   PropTypes.bool,
    'cursor-pointer'  :   PropTypes.bool,
    shy               :   PropTypes.bool,
    chosen            :   PropTypes.bool,
    success           :   PropTypes.bool,
    error             :   PropTypes.bool,
    warning           :   PropTypes.bool,
    small             :   PropTypes.bool,
    inactive          :   PropTypes.bool
  };

  static buttonInactive(e){
    e.stopPropagation();
  }

  render () {
    const classes = [this.props.className || ''];
    var {children, ...buttonProps}=this.props;

    for ( let prop in this.constructor.propTypes ) {
      if ( typeof this.props[prop] !== 'undefined') {
        if(this.props[prop]) classes.push(prop);
      }
      delete buttonProps[prop]; // outside of the loop because props={..., success: undefined} happens
    }

    return (
      <button { ...buttonProps } onClick={this.props.inactive ? Button.buttonInactive : this.props.onClick } type={ this.props.type || "button" } className={ classes.join(' ') }>
        { this.props.children }
      </button>
    );
  }
}

export default Button;
