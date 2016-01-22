'use strict';

import React                          from 'react';
import Row                            from './util/row';
import Column                         from './util/column';
import InputGroup                     from './util/input-group';
import TextInput                      from './util/text-input';
import Select                         from './util/select';
import DateInput                      from './util/date-input';
import Uploader                       from './uploader';
import userType                       from '../lib/proptypes/user';
import countryType                    from '../lib/proptypes/country';
import selectors                      from 'syn/../../selectors.json';

class Identity extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user : userType,
    countries : React.PropTypes.arrayOf(countryType)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    let { user, countries } = this.props;

    this.state = { user, countries };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveImage (file) {
    window.socket.emit('save user image', file.name, () => {});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveFirstName () {
    let firstName = React.findDOMNode(this.refs.firstName).value;

    if ( firstName ) {
      window.socket.emit('set user info', { first_name : firstName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveMiddleName () {
    let middleName = React.findDOMNode(this.refs.middleName).value;

    if ( middleName ) {
      window.socket.emit('set user info', { middle_name : middleName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveLastName () {
    let lastName = React.findDOMNode(this.refs.lastName).value;

    if ( lastName ) {
      window.socket.emit('set user info', { last_name : lastName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveGender () {
    let gender = React.findDOMNode(this.refs.gender).value;

    if ( gender ) {
      window.socket.emit('set user info', { gender });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveBirthdate () {
    let birthdate = React.findDOMNode(this.refs.birthdate).value;

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
    let citizenship = React.findDOMNode(this.refs.citizenship).value;

    if ( citizenship ) {
      window.socket.emit('set citizenship', citizenship, 0)
        .on('OK set citizenship', user => { this.setState({ user })});
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveDualCitizenship (e) {
    let dualCitizenship = React.findDOMNode(this.refs.dualCitizenship).value;

    if ( dualCitizenship ) {
      window.socket.emit('set citizenship', dualCitizenship, 1)
        .on('OK set citizenship', user => { this.setState({ user })});
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { user, countries } = this.state;

    let citizenship = '', dualCitizenship = '';

    if ( user.citizenship ) {

      if ( user.citizenship[0] ) {
        citizenship = user.citizenship[0];
      }

      if ( user.citizenship[1] ) {
        dualCitizenship = user.citizenship[1];
      }

    }

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

      let dob_year  = dob.getFullYear();
      let dob_month = dob.getMonth() + 1;
      let dob_day   = dob.getDate() + 1;

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
        <hr />
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
            <TextInput placeholder="First name" onChange={ this.saveFirstName.bind(this) } ref="firstName" defaultValue={ user.first_name} />

            <TextInput placeholder="Middle name" onChange={ this.saveMiddleName.bind(this) } ref="middleName" defaultValue={ user.middle_name}  />

            <TextInput placeholder="Last name" onChange={ this.saveLastName.bind(this) } ref="lastName" defaultValue={ user.last_name}  />
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

          <Row baseline className="gutter-y">
            <Column span="25">
              Dual citizenship
            </Column>
            <Column span="75">
              <Select block medium onChange={ this.saveDualCitizenship.bind(this) } ref="dualCitizenship" defaultValue={ dualCitizenship }>
                <option value="">Choose one</option>
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
