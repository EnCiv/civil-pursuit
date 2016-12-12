'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import Instruction          from './instruction';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { heading, className } = this.props;

    var instruction=[];
    if(this.props.type && this.props.type.instruction){
      instruction=(
        <Instruction >
          {this.props.type.instruction}
        </Instruction>
      );
    }

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
          { instruction }
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;
