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

class Residence extends React.Component {

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

  render () {
    let { user } = this.props;

    let gps;

    if ( ! this.state.user['gps validated'] ) {
      gps = (
        <Row className="gutter">
          <Column span="50">
            <Icon icon="exclamation-circle" /> Not yet validated!
          </Column>
          <Column span="50">
            <Button onClick={ this.validateGPS.bind(this) }>Validate GPS</Button>
          </Column>
        </Row>
      );
    }
    else {
      gps = (
        <Row className="gutter">
          <Column span="50">
            <Icon icon="check" /> GPS validated!
          </Column>
          <Column span="50">
            GPS validated { this.state.user['gps validated'] }
          </Column>
        </Row>
      );
    }

    let states = this.props.states.map(state => (
      <option value={ state._id }>{ state.name }</option>
    ));

    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png" responsive />
        </section>

        <section className="gutter">
          <h2>Residence</h2>
          <p>This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.</p>
        </section>

        { gps }

        <InputGroup block className="gutter">
          <TextInput placeholder="City" defaultValue={ user.city } onChange={ this.setCity.bind(this) } ref="city" />
          <Select style={{ flexBasis: '30%'}} ref="state"  onChange={ this.setState.bind(this) } defaultValue={ user.state }>{ states }</Select>
        </InputGroup>

        <InputGroup block className="gutter">
          <TextInput placeholder="Zip" defaultValue={ user.zip } onChange={ this.setZip.bind(this) } ref="zip" />
          <TextInput placeholder="Zip +4" defaultValue={ user.zip4 } onChange={ this.setZip4.bind(this) } ref="zip4" />
        </InputGroup>
      </section>
    );
  }
}

export default Residence;
