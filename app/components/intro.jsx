'use strict';

import React from 'react';
import Panel from './panel';
import Item from './item';

class Intro extends React.Component {
  render () {
    return (
      <section id="syn-intro">
        <Panel title={ this.props.intro.subject } creator={ false }>
          <Item item={ this.props.intro } buttons={ false } promote={ false } details={ false } subtype={ false } harmony={ false } edit-and-go-again={ false } />
        </Panel>
      </section>
    );
  }
}

export default Intro;
