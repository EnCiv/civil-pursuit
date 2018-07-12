'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Select                         from './util/select';


class Gender extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveGender () {
    let gender = ReactDOM.findDOMNode(this.refs.gender).value;
    if(this.props.onChange) this.props.onChange({gender});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;

    return (
              <Select block medium ref="gender" onChange={ this.saveGender.bind(this) } defaultValue={ info.gender }>
                <option value="">Choose one</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </Select>
    );
  }
}

export default Gender;
