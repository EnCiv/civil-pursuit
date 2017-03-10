'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Image                          from './util/image';
import Icon                           from './util/icon';
import Button                         from './util/button';
import InputGroup                     from './util/input-group';
import TextInput                      from './util/text-input';
import Select                         from './util/select';
import userType                       from '../lib/proptypes/user';
import DynamicSelector                from './dynamic-selector';

class Voter extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user : userType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setRegisteredVoter () {
    const registered_voter = ReactDOM.findDOMNode(this.refs.registered).value;

    if ( registered_voter ) {
      window.socket.emit('set user info', { registered_voter });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setUserInfo (obj) {
      window.socket.emit('set user info', obj );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user } = this.props;


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

        <DynamicSelector property="party" name="Political Party" className="gutter syn-row-baseline-items" split={25} info={user} onChange={ this.setUserInfo.bind(this)} />
        <DynamicSelector property="tendency" name="Political Tendency" className="gutter syn-row-baseline-items" split={25} info={user} onChange={ this.setUserInfo.bind(this)} />

      </section>
    );
  }
}

export default Voter;
