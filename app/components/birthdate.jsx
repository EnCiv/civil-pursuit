'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import DateInput                      from './util/date-input';


class Birthdate extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveBirthdate () {
    let birthdate = ReactDOM.findDOMNode(this.refs.birthdate).value;
    if ( birthdate ) {
      let dob = new Date(birthdate);
      let now = Date.now();

      if ( now > dob ) {
        window.socket.emit('set user info', { dob });
      }
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { user } = this.props;

    let dobValue;

    if ( user.dob ) {
      let dob = new Date(user.dob);

      let dob_year  = dob.getUTCFullYear();
      let dob_month = dob.getUTCMonth() + 1;
      let dob_day   = dob.getUTCDate();

      if ( dob_month < 10 ) {
        dob_month = "0" + dob_month;
      }

      if ( dob_day < 10 ) {
        dob_day = "0" + dob_day;
      }

      dobValue = [dob_year, dob_month, dob_day].join('-');
    }

    return (
          <Row baseline className="gutter-y">
            <Column span={this.props.split}>
              Birthdate
            </Column>
            <Column span={100 - this.props.split}>
              <DateInput block ref="birthdate" onChange={ this.saveBirthdate.bind(this) } defaultValue={ dobValue } />
            </Column>
          </Row>   
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Birthdate;
