'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import InputGroup                     from './util/input-group';
import TextInput                      from './util/text-input';
import Select                         from './util/select';
import Uploader                       from './uploader';
import selectors                      from '../../selectors.json';
import Gender                         from './gender';
import Birthdate                      from './birthdate';
import GenderIdentity                 from './gender-identity'

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
    let firstName = ReactDOM.findDOMNode(this.refs.firstName).value;

    if ( firstName ) {
      window.socket.emit('set user info', { first_name : firstName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveMiddleName () {
    let middleName = ReactDOM.findDOMNode(this.refs.middleName).value;

    if ( middleName ) {
      window.socket.emit('set user info', { middle_name : middleName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveLastName () {
    let lastName = ReactDOM.findDOMNode(this.refs.lastName).value;

    if ( lastName ) {
      window.socket.emit('set user info', { last_name : lastName });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveCitizenship (e) {
    let citizenship = ReactDOM.findDOMNode(this.refs.citizenship).value;

    this.setState({citizenship: citizenship});

      window.socket.emit('set user info', { "citizenship" : citizenship})
        .on('OK set user info', user => { this.setState({ user })});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveDualCitizenship (e) {
    let dualCitizenship = ReactDOM.findDOMNode(this.refs.dualCitizenship).value;

      window.socket.emit('set user info', { "dualcitizenship" : dualCitizenship})
        .on('OK set user info', user => { this.setState({ user })});

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setUserInfo(info){
        window.socket.emit('set user info', info);
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

          <SelectorRow name="Birthdate">
            <Birthdate info={user} onChange={this.setUserInfo.bind(this)}/>  
          </SelectorRow>
          <SelectorRow name="Gender">
            <Gender info={user} onChange={this.setUserInfo.bind(this)}/>
          </SelectorRow>
          { user.gender_identity ? 
            (<SelectorRow name="Gender Identity">
              <GenderIdentity info={user} onChange={this.setUserInfo.bind(this)}/>
            </SelectorRow>)
            : null
          }
        </section>

      </section>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Identity;

class SelectorRow extends React.Component{
  render(){
    return(
        <Row baseline className="gutter">
          <Column span="25">
            {this.props.name}
          </Column>
          <Column span="75">
            {this.props.children}
          </Column>
        </Row>
    );
  }
}
