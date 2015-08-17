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
    if ( this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get item details', this.props.item)
        .on('OK get item details', details => {
          this.setState({ details });
        })
    }
  }

  render () {
    let content = ( <Loading /> );

    if ( this.state.details ) {
      content = [];

      content.push(
        ( <Popularity { ...this.props.item.popularity } /> ),
        ( <Votes { ...this.state.details } /> ),
        ( <Feedback entries={ this.state.details.feedback } /> )
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
