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

class Voter extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setRegisteredVoter () {
    let registered = React.findDOMNode(this.refs.registered).value;

    if ( registered ) {
      window.socket.emit('set registered voter', registered);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setParty () {
    let party = React.findDOMNode(this.refs.party).value;

    if ( party ) {
      window.socket.emit('set party', party);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, config } = this.props;

    let parties = config.party.map(party => (
      <option value={ party._id } key={ party._id }>{ party.name }</option>
    ));

    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423262642/p61hdtkkdks8rednknqo.png" responsive />
        </section>

        <section className="gutter">
          <h2>Voter</h2>
          <p>We use this information to make sure that we have balanced participation. When we see too little participation in certain categories then we increase our efforts to get more participation there.</p>
        </section>

        <Row baseline className="gutter">
          <Column span="25">
            Registered voter
          </Column>
          <Column span="75">
            <Select block medium ref="registered" defaultValue={ user.registered_voter } onChange={ this.setRegisteredVoter.bind(this) }>
              <option value=''>Choose one</option>
              <option value={ true }>Yes</option>
              <option value={ false }>No</option>
            </Select>
          </Column>
        </Row>

        <Row baseline className="gutter">
          <Column span="25">
            Political Party
          </Column>
          <Column span="75">
            <Select block medium ref="party" defaultValue={ user.party } onChange={ this.setParty.bind(this) }>
              <option value=''>Choose one</option>
              { parties }
            </Select>
          </Column>
        </Row>
      </section>
    );
  }
}

export default Voter;
