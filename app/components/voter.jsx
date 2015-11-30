'use strict';

import React                          from 'react';
import Row                            from './util/row';
import Column                         from './util/column';
import Image                          from './util/image';
import Icon                           from './util/icon';
import Button                         from './util/button';
import InputGroup                     from './util/input-group';
import TextInput                      from './util/text-input';
import Select                         from './util/select';
import userType                       from '../lib/proptypes/user';
import politicalPartyType             from '../lib/proptypes/political-party';

class Voter extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user : userType,
    politicalParties : React.PropTypes.arrayOf(politicalPartyType)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setRegisteredVoter () {
    const registered_voter = React.findDOMNode(this.refs.registered).value;

    if ( registered_voter ) {
      window.socket.emit('set user info', { registered_voter });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setParty () {
    const party = React.findDOMNode(this.refs.party).value;

    if ( party ) {
      window.socket.emit('set user info', { party });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, politicalParties } = this.props;

    let parties = politicalParties.map(party => (
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
