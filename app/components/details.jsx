'use strict';

import React                          from 'react';
import Loading                        from './util/loading';
import Votes                          from './votes';
import Popularity                     from './popularity';
import Feedback                       from './feedback';
import itemType                       from '../lib/proptypes/item';

class Details extends React.Component {
  static propTypes = {
    active : React.PropTypes.bool,
    item : itemType
  }

  state = {}

  status = 'iddle'

  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' && props.active ) {
      this.status = 'ready';
      window.Dispatcher.emit('get details', this.props.item);
    }
  }

  render () {
    let content = ( <Loading message="Loading details" /> );

    if ( this.props.items[this.props.item._id] && this.props.items[this.props.item._id].details ) {

      let { details } = this.props.items[this.props.item._id];

      content = [];

      content.push(
        ( <Popularity { ...this.props.item.popularity } /> ),
        ( <Votes { ...details } /> ),
        ( <Feedback entries={ details.feedback } /> )
      );
    }

    return (
      <section className={`item-details ${this.props.className}`} id={ `item-details-${this.props.item._id}`}>
        { content }
      </section>
    );
  }
}

export default Details;
