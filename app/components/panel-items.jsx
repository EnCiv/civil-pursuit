'use strict';

import React from 'react';
import Panel from './panel';
import Loading from './util/loading';

class PanelItems extends React.Component {
  loadMore (e) {
    e.preventDefault();

    window.Dispatcher.emit('get more items', this.props.panel.panel);
  }

  render () {
    let title = 'Loading items';

    let type = null;

    let loaded = false;

    let content = <Loading />;

    let loadMore = ( <div className="gutter-top"></div> );

    if ( this.props.panel ) {
      let { panel } = this.props;

      type = panel.panel.type;

      title = panel.panel.type.name;

      loaded = true;

      if ( ! panel.items.length ) {
        content = (<div>No items for the moment</div>);
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
      <Panel title={ title } type={ type } loaded={ loaded } { ...this.props }>
        { content }
        { loadMore }
      </Panel>
    );
  }
}

export default PanelItems;

import Item from './item';
