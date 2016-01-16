'use strict';

import React                            from 'react';
import Row                              from './util/row';
import Column                           from './util/column';
import Component                        from '../lib/app/component';
import Range                            from './util/range';
import Slider                           from './slider';
import criteriaType                     from '../lib/proptypes/criteria';

class Sliders extends React.Component {
  static propTypes = {
    criterias : React.PropTypes.arrayOf(criteriaType)
  }

  render () {
    let { criterias } = this.props;

    let sliders = criterias.map(criteria => (
      <Slider key={ criteria._id } criteria={ criteria } />
    ));

    return (
      <div className={ Component.classList(this) }>
        { sliders }
      </div>
    );
  }
}

export default Sliders;
