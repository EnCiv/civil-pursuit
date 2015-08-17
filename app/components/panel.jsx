'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import Icon                 from './util/icon';
import Accordion            from './util/accordion';
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
      let active = null;

      if ( this.state.active !== 'creator' ) {
        active = 'creator';
      }

      this.setState({ active });



    }
    else {
      Join.click();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    let creator, creatorIcon, newItem;

    if ( this.props.creator !== false ) {
      creator = (
        <Accordion active={ this.state.active === 'creator' } poa={ this.refs.panel } { ...this.props }>
          <Creator { ...this.props } />
        </Accordion>
      );
      creatorIcon = ( <Icon icon="plus" onClick={ this.toggleCreator.bind(this) } className="toggle-creator" /> );
    }

    if ( this.props.newItem ) {
      let relevant = false;

      if ( this.props.newItem.panel.type === this.props.type ) {
        relevant = true;
      }

      if ( relevant ) {
        newItem = ( <Item item={ this.props.newItem.item } new={ true } { ...this.props } /> );
      }
    }

    let child = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { panel : this })
    );

    return (
      <section className={ Component.classList(this, "syn-panel") } ref="panel">
        <section className="syn-panel-heading">
          <h4>{ this.props.title }</h4>
          { creatorIcon }
        </section>
        <section className="syn-panel-body">
          { creator }
          { newItem }
          { child }
        </section>
      </section>
    );
  }
}

export default Panel;

import Item from './item';
