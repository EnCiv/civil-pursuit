'use strict';

import React from 'react';
import Row from './util/row';
import Column from './util/column';

class Vote extends React.Component {
  toggleDescription (e) {
    let description = React.findDOMNode(this.refs.description);
    description.classList.toggle('syn-visible');
  }

  render () {
    let { criteria } = this.props;

    return (
      <div className="syn-sliders-criteria">
        <Row>
          <Column span="40">
            <h5 onClick={ this.toggleDescription.bind(this) }>{ criteria.name }</h5>
            <h5 className="syn-sliders-criteria-description" ref="description">{ criteria.description }</h5>
          </Column>

          <Column span="60">
            
          </Column>
        </Row>
      </div>
    );
  }
}

class Votes extends React.Component {
  render () {
    let { criterias } = this.props;

    let sliders = criterias.map(criteria => (
      <Vote criteria={ criteria } />
    ));

    return (
      <div className="syn-sliders">
        { sliders }
      </div>
    );
  }
}

export default Votes;
