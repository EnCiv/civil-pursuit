'use strict';

import React from 'react';
import Button from './util/button';

class Finish extends React.Component {
  static propTypes = {
    evaluated : React.PropTypes.bool
  };

  next () {
    let { emitter } = this.props;

    //let view = this.refs.view;

    //let parent = view.closest('.item-promote');

    emitter.emit('next');
  }

  render () {
    let text = 'Neither';

    let { cursor, limit } = this.props;

    if ( cursor === limit ) {
      text = 'Finish';
    }

    return (
      <Button block { ...this.props } onClick={ this.next.bind(this) } ref="view" className="finish-evaluate">
        <b>{ text }</b>
      </Button>
    );
  }
}

export default Finish;
