'use strict';

import React from 'react';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  constructor ( props ) {
    super(props);
    this.counter = 0;
    this.height = null;
    this.visibility = false;
    this.id = null;
  }

  // Set id

  componentWillMount () {
    // if ( typeof window !== 'undefined' ) {
    //   if ( ! this.id ) {
    //     if ( ! window.accordion_id ) {
    //       window.accordion_id = 0;
    //     }
    //     this.id = window.accordion_id ++;
    //   }
    //   console.log('accordion id', accordion_id);
    // }
  }

  componentDidMount () {
    // let view = React.findDOMNode(this.refs.view);
    // let content = React.findDOMNode(this.refs.content);
    // let wrapper = React.findDOMNode(this.refs.wrapper);
    //
    // if ( ! view.id ) {
    //   view.id = `accordion-${this.id}`;
    // }
    //
    // if ( ! this.height ) {
    //   let content = React.findDOMNode(this.refs.content);
    //   let wrapper = React.findDOMNode(this.refs.wrapper);
    //   let view = React.findDOMNode(this.refs.view);
    //
    //   // this.height = content.offsetTop + 99999 + view.offsetTop;
    //
    //   this.height = 1000;
    //
    //   console.log('accordion height', this.props.name, { view: {
    //     offsetTop: view.offsetTop
    //   }, wrapper : {
    //     offsetTop : wrapper.offsetTop
    //   }, content: {
    //     offsetTop : content.offsetTop,
    //     height: content.offsetHeight
    //   }});
    //
    //   let stylesheet = document.querySelector('[rel="stylesheet"][name="stylesheet"]');
    //   let sheet = stylesheet.sheet;
    //   let rules = sheet.cssRules;
    //   sheet.insertRule(`#accordion-${this.id}.syn-accordion-wrapper { margin-top: -${this.height}px }`, rules.length);
    // }
  }

  componentWillReceiveProps (props) {

    if ( props.show > this.counter ) {
      this.counter = props.show;

      let content = React.findDOMNode(this.refs.content);
      let wrapper = React.findDOMNode(this.refs.wrapper);

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
