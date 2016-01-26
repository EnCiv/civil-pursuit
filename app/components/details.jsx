'use strict';

import React                          from 'react';
import Loading                        from './util/loading';
import Votes                          from './votes';
import Popularity                     from './popularity';
import Feedback                       from './feedback';
import itemType                       from '../lib/proptypes/item';
import DetailsStore                   from './store/details';

class Details extends React.Component {
  static propTypes = {
    active : React.PropTypes.bool,
    item : itemType
  }

  state = { changed : 0 }

  status = 'iddle'

  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' && props.active ) {
      this.status = 'ready';
      window.Dispatcher
        .emit('get details', this.props.item);
    }
  }

  render () {
    const { details } = this.props;

    let content = ( <Loading message="Loading details" /> );

    const attr = {};

    if ( details ) {

      const { item, feedback, popularity, totals } = details;

      attr.id = `item-details-${item._id}`;

      content = [];

      content.push(
        ( <Popularity { ...popularity } /> ),
        ( <Votes { ...details } /> ),
        ( <Feedback entries={ feedback } total={ totals.feedback } /> )
      );
    }

    return (
      <section className={`item-details ${this.props.className}`} { ...attr }>
        { content }
      </section>
    );
  }
}

export default Details;
