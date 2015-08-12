'use strict';

import React from 'react';

class Accordion extends React.Component {
  constructor ( props ) {
    super(props);
    this.state = { visibility : false };
  }

  componentWillReceiveProps (props) {
    if ( 'show' in props ) {
      // this.setState({ visibility : props.show });

      let view = React.findDOMNode(this.refs.view);
      let content = React.findDOMNode(this.refs.content);

      if ( props.show ) {
        let height = content.offsetHeight;
        view.style.height = height + 'px';
        // content.style.marginTop = `-${height}px`;
        setTimeout(() => {
          // content.style.position = 'relative';
          content.style.top = 0;
          content.style.opacity = 1;
        }, 1000)
      }
      else {
        // content.style.position = 'absolute';
        content.style.top = '-9000px';
        view.style.height = 0;
        content.style.opacity = 0;
      }
    }
  }

  render () {
    return (
      <section className="syn-accordion" ref="view">
        <section className="syn-accordion-content" ref="content">
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Accordion;
