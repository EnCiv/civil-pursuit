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
import DynamicSelector                from './profile-components/dynamic-selector';
import setUserInfo                  from '../api-wrapper/set-user-info';

class Voter extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user : userType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setRegisteredVoter () {
    const registered_voter = ReactDOM.findDOMNode(this.refs.registered).value;

    if ( registered_voter ) {
      setUserInfo( { registered_voter });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setUserInfo (obj) {
      setUserInfo( obj );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user } = this.props;


    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="https://res.cloudinary.com/hscbexf6a/image/upload/v1423262642/p61hdtkkdks8rednknqo.png" responsive />
        </section>

        <section className="gutter">
          <h2>Voter</h2>
          <p>We use this information to make sure that we have balanced participation. When we see too little participation in certain categories then we increase our efforts to get more participation there.</p>
        </section>

        <SelectorRow name="Registered Voter">
          <Select block medium ref="registered" defaultValue={ user.registered_voter } onChange={ this.setRegisteredVoter.bind(this) }>
              <option value=''>Choose one</option>
              <option value={ true }>Yes</option>
              <option value={ false }>No</option>
          </Select>
        </SelectorRow>
        <SelectorRow name="Political Party">
          <DynamicSelector block medium property="party" info={user} onChange={ this.setUserInfo.bind(this)} />
        </SelectorRow>
        <SelectorRow  name="Political Tendency">
          <DynamicSelector block medium property="tendency" info={user} onChange={ this.setUserInfo.bind(this)} />
        </SelectorRow>
      </section>
    );
  }
}

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
export default Voter;
