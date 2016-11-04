'use strict';

import React from 'react';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  static propTypes  =   {
    active          :   React.PropTypes.bool
  };

  counter           =   0;
  height            =   null;
  visibility        =   false;
  id                =   null;

  state             =   {
    attr            :   'hide'
  };

  constructor (props) {
    super(props);

    if ( this.props.active === true ) {
      this.state.attr = 'show';
    }
    else if ( this.props.active === false ) {
      this.state.attr = 'hide';
    }
  }

  componentWillReceiveProps (props = {}) {
    if ( props.active === true ) {
      this.setState({ attr : 'show' });
    }
    else if ( props.active === false ) {
      this.setState({ attr : 'hide' });
    }
  }

  render () {
    return (
      <section className={ `syn-accordion ${this.state.attr}` } ref="wrapper">
            { this.props.children }
      </section>
    );
  }
}

export default Accordion;
