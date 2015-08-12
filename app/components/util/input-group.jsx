'use strict';

import React                from 'react';
import Component            from '../../lib/app/component';
import Row                  from './row';

class InputGroup extends React.Component {
  render () {
    let classes = ['syn-input-group'];

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

export default InputGroup;
