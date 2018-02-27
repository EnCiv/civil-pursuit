'use strict';

import React                from 'react';
import Component            from '../../lib/app/component';

class Row extends React.Component {

  render () {
    const {baseline, end, ...newProps}=this.props;

    let classes = ['syn-row'];

    if ( baseline ) {
      classes.push('syn-row-baseline-items');
    }

    if ( end ) {
      classes.push('syn-row-end');
    }

    if ( this.props['space-around'] ) {
      classes.push('syn-row-space-around');
      delete newProps['space-around'];
    }

    if ( this.props['center-items'] ) {
      classes.push('syn-row-center-items');
      delete newProps['center-items'];
    }


    return (
      <section { ...newProps } className={ Component.classList(this, ...classes) }>
        { this.props.children }
      </section>
    );
  }
}

export default Row;
