'use strict';

import React from 'react';
import Panel from './panel';
import Item from './item';

class Intro extends React.Component {
  render () {
    return (
      <Panel title={ this.props.intro.subject }>
        <Item item={ this.props.intro } buttons={ false } />
      </Panel>
    );
  }
}

export default Intro;
