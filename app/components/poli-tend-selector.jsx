'use strict';

import React                          from 'react';
import Select                         from './util/select';
import politicalTendencyType          from '../lib/proptypes/political-tendency';

class PoliTendSelector extends React.Component {


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    valueDefault : React.PropTypes.arrayOf(politicalTendencyType),
    changeHandler: React.PropTypes.func
  };


  constructor (props) {
    console.info("PoliTendSelector.constructor");
    super(props);
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setTendency () {
    console.info("PoliTendSelector.setTendency");
    const tendency = React.findDOMNode(this.refs.tendency).value;

    if ( tendency ) {

      if(this.props.changeHandler) {
        this.props.changeHandler(tendency);
      } else {
        window.socket.emit('set user info', { tendency });
      }
    }
  }
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("politicalTendency.render:",this);
    let { valueDefault } = this.props;
    if(!(window.Synapp && window.Synapp.tendencyChoice)) {console.info("PoliTendSelector: tendencyChoice not ready yet"); return ({}); }

    const tendencyChoice = window.Synapp.tendencyChoice;

    let tendency = tendencyChoice.map(tendency => (
      <option value={ tendency._id } key={ tendency._id }>{ tendency.name }</option>
    ));

    return (
      <section>
        <Select block medium ref="tendency" defaultValue={ valueDefault } onChange={ this.setTendency.bind(this) }>
            <option value=''>Choose one</option>
            { tendency }
        </Select>
      </section>
    );
  }
}

export default PoliTendSelector; 
