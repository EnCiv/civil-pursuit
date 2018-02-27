'use strict';

import React                            from 'react';
import Row                              from './util/row';
import Column                           from './util/column';
import Component                        from '../lib/app/component';
import Range                            from './util/range';
import criteriaType                     from '../lib/proptypes/criteria';

class Slider extends React.Component {

  static propTypes = {
    criteria : criteriaType
  };

  toggleDescription (e) {
    let description = this.refs.description;
    description.classList.toggle('syn-visible');
  }

  render () {
    let { criteria, value, onChange } = this.props;

    return (
      <div id={ `criteria-slider-${criteria._id}` } className="criteria-slider">
        <Row>
          <Column span="40">
            <h5 className="syn-sliders-criteria-name" onClick={ this.toggleDescription.bind(this) }>{ criteria.name }</h5>
          </Column>

          <Column span="60">
            <Range block step="1" min="-1" max="1" value={value} defaultValue="0" data-criteria={ criteria._id } className="syn-sliders-slider" onChanage={onChange} />
          </Column>
        </Row>
        <h5 className="syn-sliders-criteria-description" ref="description">{ criteria.description }</h5>
      </div>
    );
  }
}

export default Slider;
