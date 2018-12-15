'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import InputGroup                     from './util/input-group';
import Input                          from './util/input';
import Select                         from './util/select';
import Uploader                       from './uploader';
import selectors                      from '../../selectors.json';
import Gender                         from './profile-components/gender';
import Birthdate                      from './profile-components/birthdate';
import GenderIdentity                 from './profile-components/gender-identity'
import setUserInfo                  from '../api-wrapper/set-user-info';

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

  saveFirstName (v) {
    let first_name = v.value;

    if ( first_name ) {
      setUserInfo( { first_name });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveMiddleName (v) {
    let middle_name = v.value;

    if ( middle_name ) {
      setUserInfo( { middle_name  });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveLastName () {
    let last_name = v.value;

    if ( last_name ) {
      setUserInfo( { last_name  });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveCitizenship (e) {
    let citizenship = ReactDOM.findDOMNode(this.refs.citizenship).value;

    this.setState({citizenship: citizenship});

      setUserInfo( { "citizenship" : citizenship}, user => { this.setState({ user })});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveDualCitizenship (e) {
    let dualCitizenship = ReactDOM.findDOMNode(this.refs.dualCitizenship).value;

      setUserInfo( { "dualcitizenship" : dualCitizenship}, user => { this.setState({ user })});

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setUserInfo(info){
        setUserInfo( info);
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
            <Input type='text'
              placeholder     =   "First name"
              onChange        =   { this.saveFirstName.bind(this) }
              name            =   "first-name"
              defaultValue    =   { user.first_name}
              />

            <Input type='text'
              placeholder     =   "Middle name"
              onChange        =   { this.saveMiddleName.bind(this) }
              defaultValue    =   { user.middle_name}
              name            =   "middle-name"
              />

            <Input type='text'
              placeholder     =   "Last name"
              onChange        =   { this.saveLastName.bind(this) }
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
