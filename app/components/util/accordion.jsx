'use strict';

import React from 'react';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  static propTypes  =   {
    active          :   React.PropTypes.bool
  }

  counter           =   0
  height            =   null
  visibility        =   false
  id                =   null

  state             =   {
    attr            :   'hide'
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
      <section className="syn-accordion" ref="view">
        <section className={ `syn-accordion-wrapper ${this.state.attr}` } ref="wrapper">
          <section className="syn-accordion-content" ref="content">
            { this.props.children }
          </section>
        </section>
      </section>
    );
  }
}

export default Accordion;
