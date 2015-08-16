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
            window.socket.emit('get user info')
              .on('OK get user info', ok);
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get countries')
              .on('OK get countries', ok)
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get config')
              .on('OK get config', ok)
          }),
          new Promise((ok, ko) => {
            window.socket.emit('get states')
              .on('OK get states', ok)
          })
        ])
        .then(
          results => {
            let [ user, countries, config, states ] = results;
            this.setState({ ready : true, user, countries, config, states });
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
              <Identity user={ this.state.user } countries={ this.state.countries } config={ this.state.config } />
            </Column>

            <Column span="50">
              <Residence user={ this.state.user } states={ this.state.states } />
            </Column>
          </Row>

          <Row data-stack="tablet-and-down">
            <Column span="50">
              <Demographics user={ this.state.user } config={ this.state.config } />
            </Column>

            <Column span="50">
              <Voter user={ this.state.user } config={ this.state.config } />
            </Column>
          </Row>

          <div className="text-center gutter-y">
            <Button center medium primary radius onClick={ this.done }>Done</Button>
          </div>
        </section>
      );
    }

    return (
      <Panel title="Profile" creator={ false }>
        <hr />
        <h4 className="gutter muted">Providing Profile information is optional. We know that it requires a lot of trust to provide it. We will use this information to provide you with a better experience by working to maintain diverse participation.</h4>
        <hr />

        { content }

      </Panel>
    );
  }
}

export default Profile;
