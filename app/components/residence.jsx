'use strict';

import React                          from 'react';
import Row                            from './util/row';
import Column                         from './util/column';
import Image                          from './util/image';
import Icon                           from './util/icon';
import Button                         from './util/button';
import InputGroup                     from './util/input-group';
import userType                       from '../lib/proptypes/user';
import ProfileComponent               from './profile-component';
import setUserInfo                    from '../api-wrapper/set-user-info';

class Residence extends React.Component {

  gpsAvailable=false;
  gpsError='';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user : userType,
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = { user : this.props.user };
    if(navigator && navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        position => {
          let { longitude, latitude } = position.coords;
          setUserInfo( { gps : [longitude, latitude] }, user => this.setState({ user }));
          this.gpsAvailable=true;
          }, 
        error=>{
          if(error.code!==3) this.gpsAvailable=true;
          this.gpsError=JSON.stringify(error);
        },
        {timeout: 0}
      )
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  validateGPS () {
    navigator.geolocation.watchPosition(position => {
      let { longitude, latitude } = position.coords;

      setUserInfo( { gps : [longitude, latitude] }, user => this.setState({ user }));
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setUserInfo (obj) {
      setUserInfo( obj );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user } = this.props;

    let gps;

    if ( ! this.state.user['gps validated'] ) {

        gps = this.gpsAvailable ? (
          <Row className="gutter">
            <Column span="50">
              <Icon icon="exclamation-circle" /> Not yet validated!
            </Column>
            <Column span="50">
              <Button onClick={ this.validateGPS.bind(this) }>Validate GPS</Button>
            </Column>
          </Row>
        ) : <span>{this.gpsError}</span>;
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

    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="https://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png" responsive />
        </section>

        <section className="gutter">
          <h2>Residence</h2>
          <p>This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.</p>
        </section>

        { gps }


        <InputGroup block className="gutter">
          <ProfileComponent block medium component="StreetAddress" info={user} onChange={this.setUserInfo.bind(this)}/>
        </InputGroup>

      </section>
    );
  }
}

export default Residence;
