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
          heading               =     { (<h4>{this.props.intro.subject}</h4>) }
          >
          <Item
            item                =     { this.props.intro }
            is-intro            =     { true }
            />
        </Panel>
      </section>
    );
  }
}

export default Intro;
