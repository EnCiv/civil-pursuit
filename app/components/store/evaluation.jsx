'use strict';

import React from 'react';
import selectors from 'syn/../../selectors.json';
import { EventEmitter } from 'events';

class EvaluationStore extends React.Component {

  state = {
    evaluation : null,
    cursor : 1,
    limit : 5,
    left : null,
    right : null
  }

  emitter = new EventEmitter()

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if ( ! this.state.evaluation ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }

    this.emitter.on('next', this.next.bind(this));
  }

  componentWillUnmount () {
    this.emitter.off('next', this.next.bind(this));
  }

  okGetEvaluation (evaluation) {
    if ( evaluation.item === this.props['item-id']) {
      console.log(evaluation);

      let limit = this.state.limti;

      switch ( evaluation.items.length ) {
        case 1: case 2: limit = 1; break;
        case 3: limit = 2; break;
        case 4: limit = 3; break;
        case 5: limit = 4; break;
        case 6: limit = 5; break;
      }

      let left, right;

      if ( evaluation.items[0] ) {
        left = evaluation.items[0];

        if ( right ) {
          window.socket.emit('add view', evaluation.items[0]);
        }
      }

      if ( evaluation.items[1] ) {
        right = evaluation.items[1];
        window.socket.emit('add view', evaluation.items[1]);
      }

      this.setState({ evaluation, limit, left, right });
    }
  }

  next () {
    const cursor = this.state.cursor + 1;

    let left, right;

    if ( cursor <= this.state.limit ) {
      left = this.state.evaluation.items[cursor];
      right = this.state.evaluation.items[cursor + 1];

      if ( left && right ) {
        window.socket.emit('add view', left);
        window.socket.emit('add view', right);
      }

      this.setState({ cursor, left, right });
    }

    else {
      this.setState({ evaluation : null, cursor : 1 });
      this.props.toggle('details');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, Object.assign({}, this.state, { emitter : this.emitter }))
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const attr = {};

    if ( this.state.evaluation ) {
      attr.id = selectors.evaluation.id.prefix.replace(/^#/, '') +
        this.state.evaluation.item;
    }

    return (
      <section className={ selectors.evaluation.className } { ...attr }>
        { this.renderChildren() }
      </section>
    );
  }
}

export default EvaluationStore;
