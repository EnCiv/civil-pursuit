'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Row from './util/row';
import Column from './util/column';
import Image from './util/image';
import Select from './util/select';
import StartingBlocRace from './starting-bloc-race';

class Demographics extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setEducation() {
    let education = ReactDOM.findDOMNode(this.refs.education).value;

    if (education) {
      window.socket.emit('set user info', { education });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setRelationship() {
    let relationship = ReactDOM.findDOMNode(this.refs.relationship).value;

    if (relationship) {
      window.socket.emit('set user info', { married: relationship });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setEmployment() {
    let employment = ReactDOM.findDOMNode(this.refs.employment).value;

    if (employment) {
      window.socket.emit('set user info', { employment });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  checkRace(e) {
    let checkbox = e.target;

    if (checkbox.checked) {
      window.socket.emit('add race', checkbox.value);
    }
    else {
      window.socket.emit('remove race', checkbox.value);
    }
  }

  setUserInfo(value) {
    window.socket.emit('set user info', value);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    let { user, races, educations, maritalStatuses, employments } = this.props;

    let racesList = races.map(race => (
      <Row key={race._id} className="demographics-race" id={`demographics-race-${race._id}`}>
        <Column className="gutter">
          {race.name}
        </Column>
        <Column className="gutter">
          <input
            type="checkbox"
            onChange={this.checkRace.bind(this)}
            value={race._id}
            defaultChecked={(user.race || []).some(r => r === race._id)}
          />
        </Column>
      </Row>
    ));

    let startingBlocRace = (user.starting_bloc_race ? (
      <Row>
        <Column className="gutter">
          Race (form Starting Bloc community application from):
        </Column>
        <Column>
          <StartingBlocRace info={user} onChange={this.setUserInfo.bind(this)} property={"starting_bloc_race"} />
        </Column>
      </Row>
    ) : null)

    let education = educations.map(educ => (
      <option value={educ._id} key={educ._id}>{educ.name}</option>
    ));

    let relationships = maritalStatuses.map(status => (
      <option value={status._id} key={status._id}>{status.name}</option>
    ));

    let employmentsList = employments.map(employment => (
      <option value={employment._id} key={employment._id}>{employment.name}</option>
    ));

    return (
      <section className="demographics">
        <section style={{ width: '50%', float: 'left' }}>
          <Image src="https://res.cloudinary.com/hscbexf6a/image/upload/v1423261951/y1qxy2fwmgiike5gx7ey.png" responsive />
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
            {racesList}
          </Column>
        </Row>

        {startingBlocRace}


        <section className="gutter">
          <Row baseline className="gutter-y">
            <Column span="25">
              Education
            </Column>
            <Column span="75">
              <Select block medium ref="education" defaultValue={user.education} onChange={this.setEducation.bind(this)}>
                <option value=''>Choose one</option>
                {education}
              </Select>
            </Column>
          </Row>

          <Row baseline className="gutter-y">
            <Column span="25">
              Relationship
            </Column>
            <Column span="75">
              <Select block medium ref="relationship" defaultValue={user.married} onChange={this.setRelationship.bind(this)}>
                <option value=''>Choose one</option>
                {relationships}
              </Select>
            </Column>
          </Row>

          <Row baseline className="gutter-y">
            <Column span="25">
              Employment
            </Column>
            <Column span="75">
              <Select block medium ref="employment" defaultValue={user.employment} onChange={this.setEmployment.bind(this)}>
                <option value=''>Choose one</option>
                {employmentsList}
              </Select>
            </Column>
          </Row>
        </section>
      </section>
    );
  }
}

export default Demographics;
