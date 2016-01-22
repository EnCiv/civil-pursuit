'use strict';

import React from 'react';
import selectors from 'syn/../../selectors.json';
import { EventEmitter } from 'events';
import screens from 'syn/../../screens.json';

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

  componentDidUpdate () {
    if ( ! this.state.evaluation ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }
  }

  componentWillUnmount () {
    this.emitter.removeListener('next', this.next.bind(this));
  }

  okGetEvaluation (evaluation) {
    if ( evaluation.item === this.props['item-id']) {
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

    if ( this.state.left ) {
      this.insertVotes('left', this.state.left._id);
    }

    if ( this.state.right ) {
      this.insertVotes('right', this.state.right._id);
    }

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

  getScreen () {
    return window.innerWidth < screens.phone ? 'up-to-phone' : 'phone-and-up';
  }

  insertVotes(position, itemId) {
    const sliders = React.findDOMNode(this.refs.view).querySelectorAll(`[data-screen="${this.getScreen()}"] .promote-${position} [type="range"]`);

    if ( sliders.length ) {
      const votes = [];

      for ( let i = 0; i < sliders.length; i ++ ) {
        const vote = sliders[i];

        votes.push({
          criteria  :   vote.dataset.criteria,
          value     :   vote.value,
          item      :   itemId
        });
      }

      console.log({ votes, sliders : sliders.length });

      window.socket.emit('insert votes', votes);
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
      <section className={ selectors.evaluation.className } { ...attr } ref="view">
        { this.renderChildren() }
      </section>
    );
  }
}

export default EvaluationStore;
