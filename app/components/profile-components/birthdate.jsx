'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from '../util/row';
import Column                         from '../util/column';
import DateInput                      from '../util/date-input';


class Birthdate extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveBirthdate () {
            
    let birthdate = ReactDOM.findDOMNode(this.refs.birthdate).value;
    
    if ( birthdate ) {
      let dob = new Date(birthdate);
      let now = Date.now();

      if ( now > dob ) {
        if(this.props.onChange) this.props.onChange( { dob } );
      }
    } else {
      if(this.props.onChange) this.props.onChange( { dob: null } );
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;

    let dobValue;

    if ( info.dob ) {
      let dob = new Date(info.dob);

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
              <DateInput block ref="birthdate" onChange={ this.saveBirthdate.bind(this) } defaultValue={ dobValue } placeholder="MM/DD/YYYY" />
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Birthdate;
