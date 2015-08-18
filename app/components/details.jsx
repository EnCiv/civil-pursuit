'use strict';

import React            from 'react';
import Loading          from './util/loading';
import Votes            from './votes';

class Popularity extends React.Component {
  animate () {
    let { number } = this.props;

    let bar = React.findDOMNode(this.refs.bar);
    bar.style.width = `${number}%`;
  }

  render () {
    let { number } = this.props;

    setTimeout(this.animate.bind(this), 1000);

    return (
      <div className="syn-popularity">
        <div className="syn-popularity-bar" style={{ width : 0 }} ref="bar">{ `${number}%` }</div>
      </div>
    );
  }
}

class Feedback extends React.Component {
  render () {
    let { entries } = this.props;

    console.log({ entries });

    if ( ! entries.length ) {
      return (<div></div>);
    }

    let comments = entries.map(entry => (
      <div key={ entry._id }>
        { entry.feedback }
      </div>
    ));

    return (
      <div>
        <h4>{ entries.length } feedback</h4>
        { comments }
      </div>
    );
  }
}

class Details extends React.Component {
  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = {};
  }

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
      <section className={`item-details ${this.props.className}`}>
        { content }
      </section>
    );
  }
}

export default Details;
