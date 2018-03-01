'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import ReactScrollBar from './util/react-scrollbar';
import EmailInput                     from './util/email-input';
import Button from './util/button';


class Logup extends React.Component {

    logup () {
    
        let email = ReactDOM.findDOMNode(this.refs.email).value;
        if ( email ) {
            window.socket.emit('set user info', { email });
          }
      }
    


  render () {
    const { user } = this.props;
    if(user && user.id && !user.email)
        return (
            <div className="logup-bar">
                <span>Complete setup</span>
                <div className="syn-form-group">
                <label>Email</label>
                <EmailInput block autoFocus required medium placeholder="Email" ref="email" name="email" />
                </div>
                <div className="syn-form-group syn-form-submit">
                <Button block large success radius onClick={this.logup.bind(this)}>Save Login</Button>
                </div>
            </div>
        );
    else
        return null;
  }
}

export default Logup;
