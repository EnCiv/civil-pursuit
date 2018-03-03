'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import ReactScrollBar from './util/react-scrollbar';
import EmailInput                     from './util/email-input';
import Button from './util/button';
import Login from './login';


class Logup extends React.Component {
    state={validationError: null, successMessage: null }

    logup () {
    
        let email = ReactDOM.findDOMNode(this.refs.email).value;
        if ( email ) {
            window.socket.emit('set user info', { email });
        }
        if(this.props.userInfo && this.props.userInfo.password){
            Login.signIn(email,password)
            .then(
                () => {
                  this.setState({ validationError : null, successMessage : 'Welcome' });
                  setTimeout(() => location.href = window.location.pathname, 800); 
                },
                error => {
                  this.setState({ validationError : error.message })
                }
              );
        }
    }
    


  render () {
    const { user } = this.props;
    if(user && user.id && !user.email)
        return (
            <div className="logup-bar">
                <span>Complete setup</span>
                <label>Email</label>
                <EmailInput block autoFocus required medium placeholder="Email" ref="email" name="email" />
                <Button block large success radius onClick={this.logup.bind(this)}>Save Login</Button>
                <span>{this.state.successMessage}{this.state.validationError}</span>
            </div>
        );
    else
        return null;
  }
}

export default Logup;
