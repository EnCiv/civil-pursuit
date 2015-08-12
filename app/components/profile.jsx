'use strict';

import React            from 'react';
import Component        from '../lib/app/component';
import Panel            from './panel';
import Row              from './util/row';
import Column           from './util/column';
import Identity         from './identity';
import Residence        from './residence';
import Icon             from './util/icon';

class Profile extends React.Component {
  constructor (props) {
    super(props);

    this.state = { user : null, ready : false, config: null, countries: [], states: [] };

    this.get();
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
          })
        ])
        .then(
          results => {
            let [ user, countries, config ] = results;
            this.setState({ ready : true, user, countries, config });
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
        <Row>
          <Column span="50">
            <Identity user={ this.state.user } countries={ this.state.countries } config={ this.state.config } />
          </Column>

          <Column span="50">
            <Residence user={ this.state.user } />
          </Column>
        </Row>
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
