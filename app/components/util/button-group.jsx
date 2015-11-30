'use strict';

import React                from 'react';
import Component            from '../../lib/app/component';
import Row                  from './row';

class ButtonGroup extends React.Component {
  render () {
    const classes = ['syn-button-group'];

    if ( this.props.block ) {
      classes.push('syn--block');
    }

    return (
      <section className={ Component.classList(this, ...classes) }>
        { this.props.children }
      </section>
    );
  }
}

export default ButtonGroup;
