'use strict';

import React from 'react';
import Column from './util/column';
import ItemStore from './store/item';
import Subject from './promote-item-subject';
import Description from './promote-item-description';
import Reference from './promote-reference';
import ItemMedia from './item-media';

class ColumnItem extends React.Component {
  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <ItemStore item={ item }>
          <ItemMedia />
        </ItemStore>
        <Subject subject={ item.subject } />
        <Reference { ...item.references[0] } />
        <Description description={ item.description } />
      </Column>
    );
  }
}

export default ColumnItem;
