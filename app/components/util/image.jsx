'use strict';

import React from 'react';
import Component            from '../../lib/app/component';

class Image extends React.Component {
  render () {

    let classes = [];

    if ( this.props.responsive ) {
      classes.push('syn-img-responsive');
    }

    return (
      <img alt="Synappp" src={ this.props.src } className={ Component.classList(this, ...classes) } />
    );
  }
}

export default Image;
