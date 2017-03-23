'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Select                         from './util/select';


class Neighborhood extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveNeighborhood () {
    let neighborhood = ReactDOM.findDOMNode(this.refs.neighborhood).value;

    if ( neighborhood ) {
      if(this.props.onChange) this.props.onChange({neighborhood});
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;
    let neighborhoods=['Arrowhead','Lakeside','Island','All others'];

    let neighborhoodOptions = neighborhoods.map(nh=>(
            <option value={ nh }>{ nh }</option>
        ));

    return (
        <Select {...this.props} ref="neighborhood" onChange={ this.saveNeighborhood.bind(this) } defaultValue={ info.neighborhood }>
          <option value="">Choose one</option>
          {neighborhoodOptions}
        </Select>
    );
  }
}

export default Neighborhood;
