'use strict';

import React              from 'react';
import Panel              from './panel';
import Loading            from './util/loading';
import Link               from './util/link';
import Icon               from './util/icon';
import panelType          from '../lib/proptypes/panel';

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

    window.Dispatcher.emit('set active', this.props.panel.panel, 'creator');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  unFocus () {
    window.Dispatcher.emit('set panel', this.props.panel);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let title         =     'Loading items';
    let type          =     null;
    let loaded        =     false;
    let content       =     <Loading />;
    let loadMore      =     ( <div className="gutter-top"></div> );
    let parent        =     null;
    let className     =     '';

    console.log('panel items', this.props.panel);

    if ( this.props.panel ) {
      const { panel } =     this.props;
      type            =     panel.panel.type;
      className       =     `syn-panel-${type._id}`;
      parent          =     panel.panel.parent;

      if ( parent ) {
        className     +=    `-${parent._id || parent}`;
      }

      title           =     (
        <Link
          href      =   { `/items/${type.id}/${panel.panel.parent || ""}` }
          then      =   { this.unFocus.bind(this) }
          >
          <Icon icon="angle-double-left" />
          <span> </span>
          { panel.panel.type.name }
        </Link>
      );

      loaded          =     true;

      if ( ! panel.items.length ) {
        content = (
          <div className="gutter text-center">
            <a href="#" onClick={ this.toggleCreator.bind(this) }>
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = [];

        panel.items.forEach(item => content.push(
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
