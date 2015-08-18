'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import Icon                 from './util/icon';
import Accordion            from './util/accordion';
import Loading              from './util/loading';
import Creator              from './creator';
import Join                 from './join';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = {
      showCreator : 0,
      active : false
    };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleCreator () {
    if ( this.props.user ) {
      window.Dispatcher.emit('set active', this.props, 'creator');
    }
    else {
      Join.click();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let creator, creatorIcon, newItem;

    if ( this.props.loaded ) {
      if ( this.props.creator !== false ) {
        this.id = makePanelId(this.props);
        creator = (
          <Accordion active={ this.props.panels[this.id].active === 'creator' } poa={ this.refs.panel } { ...this.props }>
            <Creator { ...this.props } panel-id={ this.id } />
          </Accordion>
        );
        creatorIcon = ( <Icon icon="plus" onClick={ this.toggleCreator.bind(this) } className="toggle-creator" /> );
      }
    }

    return (
      <section className={ Component.classList(this, "syn-panel") } ref="panel">
        <section className="syn-panel-heading">
          <h4>{ this.props.title }</h4>
          { creatorIcon }
        </section>
        <section className="syn-panel-body">
          { creator }
          { newItem }
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;

import Item from './item';
