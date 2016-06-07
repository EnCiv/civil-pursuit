'use strict';

import React                          from 'react';
import Row                            from './util/row';
import Column                         from './util/column';
import Image                          from './util/image';
import Icon                           from './util/icon';
import Button                         from './util/button';
import InputGroup                     from './util/input-group';
import TextInput                      from './util/text-input';
import Select                         from './util/select';
import userType                       from '../lib/proptypes/user';
import politicalTendencyType          from '../lib/proptypes/political-tendency';

class PoliticalTendency extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user : userType,
    politicalTendency : React.PropTypes.arrayOf(politicalTendencyType)
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setTendency () {
    const tendency = React.findDOMNode(this.refs.tendency).value;

    if ( tendency ) {

      if(this.props.setFunc) {
        this.props.setFunc(tendency);
      } else {
        window.socket.emit('set user info', { tendency });
      }
    }
  }
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("politicalTendency.render:",this);
    let { valueDefault } = this.props | '';
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

export default PoliticalTendency;
