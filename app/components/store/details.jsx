'use strict';

import React from 'react';

class DetailsStore extends React.Component {

  state = { details : null };

  componentDidMount() {
    this.okGetItemdetailsBound=this.okGetItemdetails.bind(this);
    window.socket.on('OK get item details', this.okGetItemdetailsBound);

    if ( ! this.state.details ) {
      window.socket.emit('get item details', this.props.item);
    }
  }

  componentWillUnmount() {
    window.socket.off('OK get item details', this.okGetItemdetailsBound);
  }

  okGetItemdetails (details) {
    if ( details.item._id === this.props.item._id ) {
      console.log("details", { details });
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
