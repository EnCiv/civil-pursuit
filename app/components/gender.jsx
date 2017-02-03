'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Column                         from './util/column';
import Select                         from './util/select';


class Gender extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveGender () {
    let gender = ReactDOM.findDOMNode(this.refs.gender).value;

    if ( gender ) {
      window.socket.emit('set user info', { gender });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { user } = this.props;

    return (
        <div>
            <Column span={this.props.split}>
              Gender
            </Column>
            <Column span={100 - this.props.split}>
              <Select block medium ref="gender" onChange={ this.saveGender.bind(this) } defaultValue={ user.gender }>
                <option value="">Choose one</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </Select>
            </Column>
        </div>
    );
  }
}

export default Gender;
