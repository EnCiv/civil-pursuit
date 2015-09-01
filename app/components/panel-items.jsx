'use strict';

import React from 'react';
import Panel from './panel';
import Loading from './util/loading';

class PanelItems extends React.Component {
  loadMore (e) {
    e.preventDefault();

    window.Dispatcher.emit('get more items', this.props.panel.panel);
  }

  toggleCreator (e) {
    e.preventDefault();

    window.Dispatcher.emit('set active', this.props.panel.panel, 'creator');
  }

  render () {
    let title = 'Loading items';

    let type = null;

    let loaded = false;

    let content = <Loading />;

    let loadMore = ( <div className="gutter-top"></div> );

    let parent = null;

    let className = '';

    if ( this.props.panel ) {
      let { panel } = this.props;

      type = panel.panel.type;

      className = `syn-panel-${type}`;

      parent = panel.panel.parent;

      if ( parent ) {
        className += `-${parent._id || parent}`;
      }

      title = panel.panel.type.name;

      loaded = true;

      if ( ! panel.items.length ) {
        content = (<div className="gutter text-center">
          <a href="#" onClick={ this.toggleCreator.bind(this) }>Click the + to be the first to add something here</a>
        </div>);
      }

      else {
        content = [];

        panel.items.forEach(item => content.push(
          <Item key={ item._id } { ...this.props } item={ item } />
        ));

        let { count } = panel;

        let { skip, limit } = panel.panel;

        let end = skip + limit;

        if ( count > limit ) {
          loadMore = ( <h5 className="gutter text-center">
            <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
          </h5> );
        }
      }
    }

    return (
      <Panel { ...this.props } title={ title } type={ type } parent={ parent } loaded={ loaded } className={ className }>
        { content }
        { loadMore }
      </Panel>
    );
  }
}

export default PanelItems;

import Item from './item';
