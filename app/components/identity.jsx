'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import InputGroup                     from './util/input-group';
import TextInput                      from './util/text-input';
import Select                         from './util/select';
import DateInput                      from './util/date-input';
import Uploader                       from './uploader';
import userType                       from '../lib/proptypes/user';
import countryType                    from '../lib/proptypes/country';
import selectors                      from '../../selectors.json';

class Identity extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    let { user } = this.props;

    this.state = { user, citizenship : user.citizenship || null };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveImage (file) {
    window.socket.emit('save user image', file.name, () => {});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveFirstName () {
    let firstName = ReactDOM.findDOMNode(this.refs.firstName);

    if ( firstName ) {
      window.socket.emit('set user info', { first_name : firstName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveMiddleName () {
    let middleName = ReactDOM.findDOMNode(this.refs.middleName);

    if ( middleName ) {
      window.socket.emit('set user info', { middle_name : middleName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveLastName () {
    let lastName = ReactDOM.findDOMNode(this.refs.lastName);

    if ( lastName ) {
      window.socket.emit('set user info', { last_name : lastName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveGender () {
    let gender = ReactDOM.findDOMNode(this.refs.gender);

    if ( gender ) {
      window.socket.emit('set user info', { gender });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveBirthdate () {
    let birthdate = ReactDOM.findDOMNode(this.refs.birthdate);
    if ( birthdate ) {
      let dob = new Date(birthdate);
      let now = Date.now();

      if ( now > dob ) {
        window.socket.emit('set user info', { dob });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveCitizenship (e) {
    let citizenship = ReactDOM.findDOMNode(this.refs.citizenship);

    this.setState({citizenship: citizenship});

      window.socket.emit('set user info', { "citizenship" : citizenship})
        .on('OK set user info', user => { this.setState({ user })});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveDualCitizenship (e) {
    let dualCitizenship = ReactDOM.findDOMNode(this.refs.dualCitizenship);

      window.socket.emit('set user info', { "dualcitizenship" : dualCitizenship})
        .on('OK set user info', user => { this.setState({ user })});

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { user, citizenship } = this.state;
    let { countries } = this.props;

    let dualCitizenship = user.dualcitizenship || '';

    let countryOptions1 = countries

      .filter(country => country._id !== dualCitizenship)

      .map(country => (
        <option value={ country._id } key={ country._id }>{ country.name }</option>
      ));

    let countryOptions2 = countries

      .filter(country => country._id !== citizenship)

      .map(country => (
        <option value={ country._id } key={ country._id }>{ country.name }</option>
      ));

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
      <section className={ selectors.identity.selector.replace(/\./g, ' ') }>
        <Row>
          <Column
            span        =   "50"
            className   =   { `gutter ${selectors.identity.uploader.replace(/\./g, ' ')}` }
            >
            <Uploader handler={ this.saveImage.bind(this) } image={ user.image } />
          </Column>
          <Column span="50" className="gutter">
            <h2>Identity</h2>
            <p>This information is used to identify you and make sure that you are unique.</p>
          </Column>
        </Row>

        <section className="gutter">
          <InputGroup block>
            <TextInput
              placeholder     =   "First name"
              onChange        =   { this.saveFirstName.bind(this) }
              ref             =   "firstName"
              name            =   "first-name"
              defaultValue    =   { user.first_name}
              />

            <TextInput
              placeholder     =   "Middle name"
              onChange        =   { this.saveMiddleName.bind(this) }
              ref             =   "middleName"
              defaultValue    =   { user.middle_name}
              name            =   "middle-name"
              />

            <TextInput
              placeholder     =   "Last name"
              onChange        =   { this.saveLastName.bind(this) }
              ref             =   "lastName"
              defaultValue    =   { user.last_name}
              name            =   "last-name"
              />
          </InputGroup>

          <Row baseline className="gutter-y">
            <Column span="25">
              Citizenship
            </Column>
            <Column span="75">
              <Select block medium onChange={ this.saveCitizenship.bind(this) } ref="citizenship" defaultValue={ citizenship }>
                <option value="">Choose one</option>
                { countryOptions1 }
              </Select>
            </Column>
          </Row>

          <Row baseline className="gutter-y" style={ citizenship ? { } : { display : 'none' } }>
            <Column span="25">
              Second Citizenship?
            </Column>
            <Column span="75">
              <Select block medium onChange={ this.saveDualCitizenship.bind(this) } ref="dualCitizenship" defaultValue={ dualCitizenship }>
                <option value="">none</option>
                { countryOptions2 }
              </Select>
            </Column>
          </Row>

          <Row baseline className="gutter-y">
            <Column span="25">
              Birthdate
            </Column>
            <Column span="75">
              <DateInput block ref="birthdate" onChange={ this.saveBirthdate.bind(this) } defaultValue={ dobValue } />
            </Column>
          </Row>

          <Row baseline className="gutter-y">
            <Column span="25">
              Gender
            </Column>
            <Column span="75">
              <Select block medium ref="gender" onChange={ this.saveGender.bind(this) } defaultValue={ user.gender }>
                <option value="">Choose one</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </Select>
            </Column>
          </Row>
        </section>

      </section>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Identity;
