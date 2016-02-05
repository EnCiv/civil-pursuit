'use strict';

import React from 'react';
import selectors from 'syn/../../selectors.json';
import { EventEmitter } from 'events';
import screens from 'syn/../../screens.json';

class EvaluationStore extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    evaluation : null,
    cursor : 1,
    limit : 5,
    left : null,
    right : null
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  emitter = new EventEmitter()

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    if ( ! this.state.evaluation ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }

    this.panelEmitter = this.props.emitter;

    this.emitter
      .on('next', this.next.bind(this))
      .on('promote', this.promote.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
    if ( ! this.state.evaluation && this.props.active && this.props.active.item === this.props['item-id'] && this.props.active.section === 'promote' ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount () {
    this.emitter
      .removeListener('next', this.next.bind(this))
      .removeListener('promote', this.promote.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetEvaluation (evaluation) {
    if ( evaluation.item === this.props['item-id'] ) {

      let limit = this.state.limti;

      switch ( evaluation.items.length ) {
        case 1: case 2: limit = 1; break;
        case 3: limit = 2; break;
        case 4: limit = 3; break;
        case 5: limit = 4; break;
        case 6: limit = 5; break;
      }

      let left, right;

      if ( evaluation.items[1] ) {
        right = evaluation.items[1];
        window.socket.emit('add view', evaluation.items[1]);
      }

      if ( evaluation.items[0] ) {
        left = evaluation.items[0];

        if ( right ) {
          window.socket.emit('add view', evaluation.items[0]);
        }
      }

      this.setState({ evaluation, limit, left, right });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  next () {
    let cursor = this.state.cursor;
    let regular = true;

    if ( cursor + 2 > this.state.limit ) {
      cursor += 1;
      regular = false;
    }
    else {
      cursor += 2;
    }

    let left, right;

    if ( this.state.left ) {
      this.insertVotes('left', this.state.left._id);
      this.insertFeedback('left', this.state.left._id);
    }

    if ( this.state.right ) {
      this.insertVotes('right', this.state.right._id);
      this.insertFeedback('right', this.state.right._id);
    }

    if ( cursor <= this.state.limit ) {

      left = this.state.evaluation.items[regular ? cursor - 1 : cursor];
      right = this.state.evaluation.items[regular ? cursor : cursor + 1];

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

  getScreen () {
    return window.innerWidth < screens.phone ? 'up-to-phone' : 'phone-and-up';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

  insertFeedback(position, itemId) {
    const feedback = React.findDOMNode(this.refs.view)
      .querySelector(`[data-screen="${this.getScreen()}"] .promote-${position} .user-feedback`)
      .value;

    console.log('insert feedback', feedback);

    if ( feedback ) {
      window.socket.emit('insert feedback', this.state.evaluation.item, feedback);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  promote (position) {
    const opposite = position === 'left' ? 'right' : 'left';

    const cursor = this.state.cursor + 1;

    let right = this.state.right, left = this.state.left;

    if ( cursor > this.state.limit ) {
      window.socket.emit('promote', this.state[position]);
    }

    this.insertVotes(opposite, this.state[opposite]._id);

    if ( cursor <= this.state.limit ) {

      if ( left && right ) {
        window.socket.emit('add view', this.state[position]);
        window.socket.emit('add view', this.state[opposite]);
      }

      this.setState({
        cursor,
        [opposite] : this.state.evaluation.items[cursor]
      });
    }

    else {
      this.insertVotes(position, this.state[position]._id);
      this.setState({ evaluation : null, cursor : 1 });
      this.props.toggle('details');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, Object.assign({}, this.state, { emitter : this.emitter, panelEmitter : this.panelEmitter }))
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const attr = {};

    const dataset = {
      items : []
    };

    if ( this.state.evaluation ) {
      attr.id = selectors.evaluation.id.prefix.replace(/^#/, '') +
        this.state.evaluation.item;

      dataset.items = this.state.evaluation.items.map(item => item._id);
    }

    return (
      <section className={ selectors.evaluation.className } { ...attr } ref="view" data-items={ dataset.items.join(',') }>
        { this.renderChildren() }
      </section>
    );
  }
}

export default EvaluationStore;
