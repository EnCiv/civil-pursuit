'use strict';

import React                from 'react';
import Component            from '../../lib/app/component';

class Row extends React.Component {

  render () {


    let classes = ['syn-row'];

    if ( this.props.baseline ) {
      classes.push('syn-row-baseline-items');
    }

    if ( this.props.end ) {
      classes.push('syn-row-end');
    }

    if ( this.props['space-around'] ) {
      classes.push('syn-row-space-around');
    }

    if ( this.props['center-items'] ) {
      classes.push('syn-row-center-items');
    }


    return (
      <section { ...this.props } className={ Component.classList(this, ...classes) }>
        { this.props.children }
      </section>
    );
  }
}

export default Row;
