'use strict';

import React from 'react';
import Panel from './panel';
import Item  from './item';
import Loading from './util/loading';

class TopLevelPanel extends React.Component {
  loadMore (e) {
    e.preventDefault();

    window.Dispatcher.emit('get more items', this.props.topLevelType._id);
  }

  render () {

    let items = ( <Loading /> );

    let loadMore = ( <div className="gutter-top"></div> );

    let title = 'Loading items';

    let type = null;

    let loaded = false;

    if ( this.props.topLevelType ) {
      type = this.props.topLevelType;
      title = type.name;

      loaded = true;

      if ( this.props.panels[type._id] ) {
        items = this.props.panels[type._id].items.map(item => {
          return (<Item item={ item } key={ item._id } { ...this.props } />);
        });

        let { skip, limit, count } = this.props.panels[type._id];

        let end = skip + limit;

        if ( count > limit ) {
          loadMore = ( <h5 className="gutter text-center">
            <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
          </h5> );
        }
      }
    }

    return (
      <Panel title={ title } type={ type } { ...this.props } loaded={ loaded }>
        { items }
        { loadMore }
      </Panel>
    );
  }
}

export default TopLevelPanel;
