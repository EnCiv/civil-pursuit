'use strict';

import React              from 'react';
import Panel              from './panel';
import Loading            from './util/loading';
import Link               from './util/link';
import Icon               from './util/icon';
import panelType          from '../lib/proptypes/panel';
import makePanelId        from '../lib/app/make-panel-id';
import Join               from './join';

class PanelItems extends React.Component {

  static propTypes  =   {
    panel           :   panelType
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore (e) {
    e.preventDefault();

    window.Dispatcher.emit('get more items', this.props.panel.panel);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleCreator (e) {
    e.preventDefault();

    if ( this.props.user ) {
      window.Dispatcher.emit('set active', this.props, 'creator');
    }
    else {
      Join.click();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  unFocus () {
    // window.Dispatcher.emit('refresh');
    // const panelId = makePanelId(this.props.panel.panel);
    // const hidden = document.querySelectorAll(`.syn-panel-${panelId} > .syn-panel-body > .item-hidden`);
    //
    // for ( let i = 0; i < hidden.length; i++ ) {
    //   hidden[i].classList.remove('item-hidden');
    // }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let title           =     'Loading items',
      type              =     null,
      loaded            =     false,
      content           =     ( <Loading /> ),
      loadMore          =     ( <div className="gutter-top"></div> ),
      parent            =     null,
      className         =     '';

    const { panel }     =     this.props;

    if ( panel ) {
      type              =     panel.panel.type;
      className         =     `syn-panel-${type._id}`;
      parent            =     panel.panel.parent;

      if ( parent ) {
        className       +=    `-${parent._id || parent}`;
      }

      title             =     (
        <Link
          href        =   { `/items/${type.id}/${panel.panel.parent || ""}` }
          then        =   { this.unFocus.bind(this) }
          >
          <Icon icon="angle-double-left" />
          <span> </span>
          { panel.panel.type.name }
        </Link>
      );

      title = panel.panel.type.name;

      loaded            =     true;

      let { items }     =     panel;

      if ( ! items.length ) {
        content = (
          <div className="gutter text-center">
            <a href="#" onClick={ this.toggleCreator.bind(this) } className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = [];

        // if ( this.props.focus.item && ( makePanelId(this.props.focus.item) === makePanelId(panel.panel) )) {
        //
        //   console.warn('neeen!')
        //
        //   items = items.filter(panelItem => panelItem._id === this.props.focus.item._id);
        // }

        items = items.filter(panelItem => ! panelItem.__hidden);

        items.forEach(item => content.push(
          <Item key={ item._id } { ...this.props } item={ item } />
        ));

        const { count } = panel;

        const { skip, limit } = panel.panel;

        const end = skip + limit;

        if ( count > limit ) {
          loadMore = (
            <h5 className="gutter text-center">
              <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
            </h5>
          );
        }
      }
    }

    return (
      <Panel
        { ...this.props }
        title       =   { title }
        type        =   { type }
        parent      =   { parent }
        loaded      =   { loaded }
        className   =   { className }
        ref         =   "panel"
        >
        { content }
        { loadMore }
      </Panel>
    );
  }
}

export default PanelItems;

import Item from './item';
