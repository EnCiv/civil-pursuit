'use strict';

import React from 'react';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  constructor ( props ) {
    super(props);
    this.counter = 0;
  }

  componentWillReceiveProps (props) {
    if ( props.show > this.counter ) {
      this.counter = props.show;

      let wrapper   =   React.findDOMNode(this.refs.wrapper);

      if ( this.props.poa ) {
        let poa     = React.findDOMNode(this.props.poa);
        window.scrollTo(0, ( poa.offsetTop  - 60 ));
      }

      wrapper.classList.toggle('show');
    }
  }

  render () {
    return (
      <section className="syn-accordion" ref="view">
        <section className="syn-accordion-wrapper" ref="wrapper">
          <section className="syn-accordion-content" ref="content">
            { this.props.children }
          </section>
        </section>
      </section>
    );
  }
}

export default Accordion;
