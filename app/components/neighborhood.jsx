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
      window.socket.emit('set user info', { neighborhood });
      if(this.props.onChange) this.props.onChange({neighborhood});
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { user } = this.props;
    let neighborhoods=['Arrowhead','Lakeside','Island','All others'];

    let neighborhoodOptions = neighborhoods.map(nh=>(
            <option value={ nh }>{ nh }</option>
        ));

    return (
        <Row baseline className="gutter-y">
            <Column span={this.props.split}>
              Neighborhood
            </Column>
            <Column span={100 - this.props.split}>
              <Select block medium ref="neighborhood" onChange={ this.saveNeighborhood.bind(this) } defaultValue={ user.neighborhood }>
                <option value="">Choose one</option>
                {neighborhoodOptions}
              </Select>
            </Column>
        </Row>
    );
  }
}

export default Neighborhood;
