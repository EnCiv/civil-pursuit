'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import Icon                 from './util/icon';
import Accordion            from './util/accordion';
import Loading              from './util/loading';
import Creator              from './creator';
import Join                 from './join';
import userType             from '../lib/proptypes/user';
import panelType            from '../lib/proptypes/panel';
import makePanelId          from '../lib/app/make-panel-id';

class Panel extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes    =   {
    user              :   userType,
    loaded            :   React.PropTypes.bool,
    creator           :   React.PropTypes.bool,
    panels            :   React.PropTypes.object,
    title             :   React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
    parent            :   React.PropTypes.string
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    showCreator   :   0,
    active        :   false
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

        if ( ! this.props.panels[this.id] ) {
          console.warn('No such panel with this id', this.id);
        }

        else {
          creator = (
            <Accordion
              { ...this.props }
              active    =   { this.props.panels[this.id].active === 'creator' } poa       =   { this.refs.panel }
              >
              <Creator { ...this.props } item={ false } panel-id={ this.id } />
            </Accordion>
          );

          creatorIcon     =   (
            <Icon
              icon        =   "plus"
              onClick     =   { this.toggleCreator.bind(this) }
              className   =   "toggle-creator"
              />
          );
        }
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
