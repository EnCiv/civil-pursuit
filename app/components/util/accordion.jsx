'use strict';

import React from 'react';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  constructor ( props ) {
    super(props);
    this.status = 'CLOSED';
    this.counter = 0;
  }

  componentWillReceiveProps (props) {
    // console.info('-- update accordion --', { name : props.name, status : this.status, request : props.show, counter : this.counter, close: props.close });

    // if ( props.close && ( this.status === 'OPENED' ) ) {
    //   console.warn('Closing upon request');
    //   return this.hide();
    // }

    if ( props.show > this.counter ) {
      this.counter = props.show;

      switch ( this.status ) {
        case 'CLOSED':
          this.status = 'OPENING';
          window.Dispatcher.emit('open request');
          this.show();
          break;
        case 'OPENED':
          this.status = 'CLOSING';
          this.hide();
          break;
      }
    }
  }

  show () {
    let view    = React.findDOMNode(this.refs.view);
    let wrapper = React.findDOMNode(this.refs.wrapper);
    let content = React.findDOMNode(this.refs.content);

    if ( this.props.poa ) {
      let poa     = React.findDOMNode(this.props.poa);
      window.scrollTo(0, ( poa.offsetTop  - 60 ));
    }

    wrapper.style.marginTop = 0;

    this.status = 'OPENED';
  }

  hide () {
    let view    = React.findDOMNode(this.refs.view);
    let wrapper = React.findDOMNode(this.refs.wrapper);
    let content = React.findDOMNode(this.refs.content);

    if ( this.props.poa ) {
      let poa     = React.findDOMNode(this.props.poa);
      window.scrollTo(0, ( poa.offsetTop  - 60 ));
    }

    wrapper.style.marginTop = '-100%';

    this.status = 'CLOSED';
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
