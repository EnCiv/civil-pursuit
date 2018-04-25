'use strict';

import React from 'react';

class Select extends React.Component {
  render () {
    let classes = ['bp_input'];

    let props = ['block', 'small', 'medium', 'large'];
    const {children, className, ...newProps}=this.props;

    for ( let prop of props ) {
      if ( this.props[prop] ) {
        classes.push(prop);
        delete newProps[prop];
      }
    }


    return (
      <select className={ classes.join(' ') } { ...newProps }>
        { children }
      </select>
    );
  }
}

export default Select;
