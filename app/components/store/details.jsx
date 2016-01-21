'use strict';

import React from 'react';

class DetailsStore extends React.Component {

  state = { details : null }

  componentDidMount() {
    window.socket.on('OK get item details', this.okGetItemdetails.bind(this));

    if ( ! this.state.details ) {
      window.socket.emit('get item details', this.props.item);
    }
  }

  componentWillUnmount() {
    window.socket.off('OK get item details', this.okGetItemdetails.bind(this));
  }

  okGetItemdetails (details) {
    console.log({ details });
    if ( details.item._id === this.props.item._id ) {
      console.log({ details });
      this.setState({ details });
    }
  }

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, this.state)
    );
  }

  render () {
    return (
      <section className="syn-details">
        { this.renderChildren() }
      </section>
    );
  }
}

export default DetailsStore;
