'use strict';

import React            from 'react';
import Component        from '../lib/app/component';
import Panel            from './panel';
import Row              from './util/row';
import Column           from './util/column';
import Identity         from './identity';
import Residence        from './residence';
import Icon             from './util/icon';
import Button           from './util/button';
import Demographics     from './demographics';
import Voter            from './voter';

class Profile extends React.Component {
  constructor (props) {
    super(props);

    this.state = { user : null, ready : false, config: null, countries: [], states: [] };

    this.get();
  }

  done () {
    location.href = '/';
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      Promise
        .all([
          new Promise((ok, ko) => {
            window.socket.emit('get user info', ok);
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get countries', ok)
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get states', ok)
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get races', ok)
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get educations', ok)
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get marital statuses', ok)
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get employments', ok)
          })
        ])
        .then(
          results => {
            let [ user, countries, states, races, educations, maritalStatuses, employments ] = results;
            this.setState({ ready : true, user, countries, states, races, educations, maritalStatuses, employments });
          }
        );
    }
  }

  render() {
    let content = (
      <div className={ Component.classList(this, 'text-center', 'gutter', 'muted') }>
        <Icon icon="circle-o-notch" spin={ true } size={ 4 } />
      </div>
    );

    if ( this.state.ready ) {
      content = (
        <section>
          <Row data-stack="tablet-and-down">
            <Column span="50">
              <Identity { ...this.state } />
            </Column>

            <Column span="50">
              <Residence { ...this.state } />
            </Column>
          </Row>

          <Row data-stack="tablet-and-down">
            <Column span="50">
              <Demographics { ...this.state } />
            </Column>

            <Column span="50">
              <Voter { ...this.state } />
            </Column>
          </Row>

          <div className="text-center gutter-y">
            <Button medium primary radius onClick={ this.done }>Done</Button>
          </div>
        </section>
      );
    }

    return (
      <Panel title="Profile">
        <div className="table" >
         <div className="table-left">
          <h4 className="gutter muted">Providing profile information is optional. We know that it requires a lot of trust to provide it. We will use this information to provide you with a better experience by working to maintain diverse participation.</h4>
         </div>
         <div className="table-right">
          <div className="text-right gutter-y">
            <Button radius onClick={ this.done }>Skip</Button>
          </div>
         </div>
        </div>
        { content }
      </Panel>
    );
  }
}

export default Profile;
