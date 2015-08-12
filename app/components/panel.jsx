'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import Icon                 from './util/icon';
import Accordion            from './util/accordion';
import Creator              from './creator';

class Panel extends React.Component {
  componentWillReceiveProps (props) {
    // console.warn('panel', props);
  }

  render() {
    let creator, creatorIcon;

    if ( this.props.creator !== false ) {
      creator = (
        <Accordion>
          <Creator { ...this.props } />
        </Accordion>
      );
      creatorIcon = ( <Icon icon="plus" /> );
    }

    return (
      <section className={ Component.classList(this, "syn-panel") }>
        <section className="syn-panel-heading">
          <h4>{ this.props.title }</h4>
          { creatorIcon }
        </section>
        <section className="syn-panel-body">
          { creator }
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;
