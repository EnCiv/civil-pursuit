'use strict';

import React from 'react';
import Column from './util/column';
import Sliders from './sliders';

class ColumnSliders extends React.Component {
  render () {
    let { item, position, criterias } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <Sliders criterias={ criterias } className="promote-sliders" />
      </Column>
    );
  }
}

export default ColumnSliders;
