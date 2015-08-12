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

        let visibleAccordions = document.querySelectorAll('.syn-accordion.visible');

        view.classList.add('visible');
        let height = content.offsetHeight;
        view.style.height = height + 'px';
        // content.style.marginTop = `-${height}px`;
        setTimeout(() => {
          view.classList.remove('visible');
          content.style.position = 'relative';
          content.style.top = 0;
          // content.style.display = block;
          // content.style.marginTop = 0;
          // content.style.opacity = 1;
          // content.style.transform = 'rotateY(0deg)'
        }, 1000)
      }
      else {
        view.style.height = 0;
        content.style.position = 'absolute';
        content.style.top = '-9000px';
        // content.style.opacity = 0;
        // content.style.display = 'none';
      }
    }
  }

  render () {
    return (
      <section className="syn-accordion" ref="view">
        <section>
          <section className="syn-accordion-content" ref="content">
            { this.props.children }
          </section>
        </section>
      </section>
    );
  }
}

export default Accordion;
