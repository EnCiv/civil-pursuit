'use strict';

import React            from 'react';
import Row              from './util/row';
import Column           from './util/column';
import Image            from './util/image';
import Icon             from './util/icon';
import Button           from './util/button';
import InputGroup       from './util/input-group';
import TextInput        from './util/text-input';
import Select           from './util/select';

class Demographics extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = { user : this.props.user };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  validateGPS () {
    navigator.geolocation.watchPosition(position => {
      let { longitude, latitude } = position.coords;

      window.socket.emit('validate gps', longitude, latitude)
        .on('OK validate gps', user => this.setState({ user }));
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setCity () {
    let city = React.findDOMNode(this.refs.city).value;

    if ( city ) {
      window.socket.emit('set city', city);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setState () {
    let state = React.findDOMNode(this.refs.state).value;

    if ( state ) {
      window.socket.emit('set state', state);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setZip () {
    let zip = React.findDOMNode(this.refs.zip).value;

    if ( zip ) {
      window.socket.emit('set zip', zip);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setZip4 () {
    let zip4 = React.findDOMNode(this.refs.zip4).value;

    if ( zip4 ) {
      window.socket.emit('set zip4', zip4);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setEducation () {
    let education = React.findDOMNode(this.refs.education).value;

    if ( education ) {
      window.socket.emit('set education', education);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setRelationship () {
    let relationship = React.findDOMNode(this.refs.relationship).value;

    if ( relationship ) {
      window.socket.emit('set marital status', relationship);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setEmployment () {
    let employment = React.findDOMNode(this.refs.employment).value;

    if ( employment ) {
      window.socket.emit('set employment', employment);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  checkRace (e) {
    let checkbox = e.target;

    if ( checkbox.checked ) {
      window.socket.emit('add race', checkbox.value);
    }
    else {
      window.socket.emit('remove race', checkbox.value);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, config } = this.props;

    let races = config.race.map(race => (
      <Row key={ race._id }>
        <Column className="gutter">
          { race.name }
        </Column>
        <Column className="gutter">
          <input type="checkbox" onClick={ this.checkRace.bind(this) } value={ race._id } checked={ user.race.some(r => r === race._id) } />
        </Column>
      </Row>
    ));

    let education = config.education.map(educ => (
      <option value={ educ._id } key={ educ._id }>{ educ.name }</option>
    ));

    let relationships = config.married.map(status => (
      <option value={ status._id } key={ status._id }>{ status.name }</option>
    ));

    let employments = config.employment.map(employment => (
      <option value={ employment._id } key={ employment._id }>{ employment.name }</option>
    ));

    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423261951/y1qxy2fwmgiike5gx7ey.png" responsive />
        </section>

        <section className="gutter">
          <h2>Demographics</h2>
          <p>We use this information to make sure that we have balanced participation. When we see too little participation in certain demographics then we increase our efforts to get more participation there</p>
        </section>

        <Row>
          <Column className="gutter">
            Race:
          </Column>
          <Column>
            { races }
          </Column>
        </Row>

        <section className="gutter">
          <Row baseline className="gutter-y">
            <Column span="25">
              Education
            </Column>
            <Column span="75">
              <Select block medium ref="education" defaultValue={ user.education } onChange={ this.setEducation.bind(this) }>
                <option value=''>Choose one</option>
                { education }
              </Select>
            </Column>
          </Row>

          <Row baseline className="gutter-y">
            <Column span="25">
              Relationship
            </Column>
            <Column span="75">
              <Select block medium ref="relationship" defaultValue={ user.married } onChange={ this.setRelationship.bind(this) }>
                <option value=''>Choose one</option>
                { relationships }
              </Select>
            </Column>
          </Row>

          <Row baseline className="gutter-y">
            <Column span="25">
              Employment
            </Column>
            <Column span="75">
              <Select block medium ref="employment" defaultValue={ user.employment } onChange={ this.setEmployment.bind(this) }>
              <option value=''>Choose one</option>
              { employments }
              </Select>
            </Column>
          </Row>
        </section>
      </section>
    );
  }
}

export default Demographics;
