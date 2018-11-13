'use strict';

import React from 'react';
import Component            from '../../lib/app/component';
import PropTypes from 'prop-types';

class Column extends React.Component {
  static propTypes = {
    style : PropTypes.object,
    span :  PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  style () {
    const style = this.props.style || {};

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
