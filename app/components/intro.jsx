'use strict';

import React              from 'react';
import Panel              from './panel';
import Item               from './item';
import panelItemType      from '../lib/proptypes/panel-item';

class Intro extends React.Component {

  static propTypes    =   {
    intro             :   panelItemType
  }

  render () {
    return (
      <section id               =     "syn-intro">
        <Panel
          title                 =     { this.props.intro.subject }
          creator               =     { false }
          >
          <Item
            item                =     { this.props.intro }
            is-intro            =     { true }
            buttons             =     { false }
            promote             =     { false }
            details             =     { false }
            subtype             =     { false }
            harmony             =     { false }
            edit-and-go-again   =     { false } />
        </Panel>
      </section>
    );
  }
}

export default Intro;
