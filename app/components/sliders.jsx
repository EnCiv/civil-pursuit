'use strict';

import React from 'react';
import Row from './util/row';
import Column from './util/column';
import Component from '../lib/app/component';

class Slider extends React.Component {
  toggleDescription (e) {
    let description = React.findDOMNode(this.refs.description);
    description.classList.toggle('syn-visible');
  }

  render () {
    let { criteria } = this.props;

    return (
      <div>
        <Row>
          <Column span="40">
            <h5 onClick={ this.toggleDescription.bind(this) }>{ criteria.name }</h5>
            <h5 className="syn-sliders-criteria-description" ref="description">{ criteria.description }</h5>
          </Column>

          <Column span="60">
            <input type="range" />
          </Column>
        </Row>
      </div>
    );
  }
}

class Sliders extends React.Component {
  render () {
    let { criterias } = this.props;

    let sliders = criterias.map(criteria => (
      <Slider criteria={ criteria } />
    ));

    return (
      <div className={ Component.classList(this) }>
        { sliders }
      </div>
    );
  }
}

export default Sliders;
