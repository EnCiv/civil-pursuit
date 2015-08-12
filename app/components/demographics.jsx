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

  render () {
    let { user } = this.props;


    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423261951/y1qxy2fwmgiike5gx7ey.png" responsive />
        </section>

        <section className="gutter">
          <h2>Demographics</h2>
          <p>We use this information to make sure that we have balanced participation. When we see too little participation in certain demographics then we increase our efforts to get more participation there</p>
        </section>
      </section>
    );
  }
}

export default Demographics;
