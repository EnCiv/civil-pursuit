'use strict';

import React from 'react';

class Accordion extends React.Component {
  render () {
    return (
      <section className="syn--acordion">
        <section>
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Accordion;
