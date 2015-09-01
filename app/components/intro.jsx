'use strict';

import React from 'react';
import Panel from './panel';
import Item from './item';

class Intro extends React.Component {
  render () {
    return (
      <Panel title={ this.props.intro.subject } creator={ false } id="syn-intro">
        <Item item={ this.props.intro } buttons={ false } promote={ false } details={ false } subtype={ false } harmony={ false } edit-and-go-again={ false } />
      </Panel>
    );
  }
}

export default Intro;
