'use strict';

import React                from 'react';
import Component            from '../lib/app/component';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { heading, className } = this.props;



    return (
      <section
        { ...this.props }
        className     =   { (className || '') + " syn-panel" }
        ref           =   "panel"
      >
        <section className="syn-panel-heading">
          { heading }
        </section>
        <section className="syn-panel-body">
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;
