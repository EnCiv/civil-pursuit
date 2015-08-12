'use strict';

import React from 'react';
import Component            from '../../lib/app/component';

class Column extends React.Component {
  style () {
    let style = this.props.style || {};

    if ( this.props.span ) {
      style.flexBasis = `${this.props.span}%`;
    }

    return style;
  }

  render () {
    return (
      <section className={ Component.classList(this, "syn-column") } style={ this.style() }>
        { this.props.children }
      </section>
    );
  }
}

export default Column;
