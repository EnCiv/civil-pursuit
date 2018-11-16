'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Select                         from '../util/select';


class MemberType extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveMemberType () {
    let member_type = ReactDOM.findDOMNode(this.refs.member_type).value;
    if(this.props.onChange) this.props.onChange({member_type});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;
    let memberTypes=['Club/Golf','Club'];

    let memberTypeOptions = memberTypes.map(val=>(
            <option value={ val }>{ val }</option>
        ));

    return (
        <Select {...this.props} ref="member_type" onChange={ this.saveMemberType.bind(this) } defaultValue={ info.member_type }>
          <option value="">Choose one</option>
          {memberTypeOptions}
        </Select>
    );
  }
}

export default MemberType;
