'use strict';

import React from 'react';
import Component from '../lib/app/component';

class Panel extends React.Component {
  render() {
    return (
      <section className={ Component.classList(this, "syn-panel") }>
        <section className="syn-panel-heading">
          <h4>{ this.props.title }</h4>
        </section>
        <section className="syn-panel-body">
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;
