'use strict';

import React              from 'react';
import selectors          from '../../../selectors.json';
import screens            from '../../../screens.json';

class EvaluationStore extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    evaluation : null,
    limit : 5
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    if ( ! this.state.items ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
    if ( ! this.state.items && this.props.active && this.props.active.item === this.props['item-id'] && this.props.active.section === 'promote' ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetEvaluation (evaluation) {
    const item=evaluation.item;
    if ( item === this.props['item-id'] ) {

      let limit = this.state.limit;

      switch ( evaluation.items.length ) {
        case 1: case 2: limit = 1; break;
        case 3: limit = 2; break;
        case 4: limit = 3; break;
        case 5: limit = 4; break;
        case 6: limit = 5; break;
      }

      this.setState({ items: evaluation.items, criterias: evaluation.criterias, itemId: item, limit });
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, Object.assign({}, this.state))
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const attr = {};

    const dataset = {
      items : []
    };

    if ( this.state.items ) {
      attr.id = selectors.evaluation.id.prefix.replace(/^#/, '') +
        this.state.itemId;

      dataset.items = this.state.items.map(item => item._id);
    }

    return (
      <section className={ selectors.evaluation.className } { ...attr } ref="view" data-items={ dataset.items.join(',') }>
        { this.renderChildren() }
      </section>
    );
  }
}

export default EvaluationStore;
