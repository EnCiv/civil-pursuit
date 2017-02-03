'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Select                         from './util/select';


class MemberType extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveMemberType () {
    let member_type = ReactDOM.findDOMNode(this.refs.member_type).value;

    if ( member_type ) {
      window.socket.emit('set user info', { member_type });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { user } = this.props;
    let memberTypes=['Golf','Non-Golf'];

    let memberTypeOptions = memberTypes.map(val=>(
            <option value={ val }>{ val }</option>
        ));

    return (
        <Row baseline className="gutter-y">
            <Column span={this.props.split}>
              Member Type
            </Column>
            <Column span={100 - this.props.split}>
              <Select block medium ref="member_type" onChange={ this.saveMemberType.bind(this) } defaultValue={ user.member_type }>
                <option value="">Choose one</option>
                {memberTypeOptions}
              </Select>
            </Column>
        </Row>
    );
  }
}

export default MemberType;
