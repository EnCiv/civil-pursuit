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
            window.socket.emit('set user info', { email }, this.login.bind(this,email,this.props.user && this.props.user.tempid));
        }
    }
    
    login(email, password){
        Login.signIn(email,this.props.user.tempid)
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


  render () {
    const { user } = this.props;
    if(user && user.id && !user.email)
        return (
            <div className="logup-bar">
                <div className="logup-bar-center">
                    <span>Complete setup</span>
                    <label>Email</label>
                    <div className="logup-bar-input">
                        <EmailInput block autoFocus required medium placeholder="Email" ref="email" name="email" />
                    </div>
                    <div className="logup-bar-button">
                        <Button block large success radius onClick={this.logup.bind(this)}>Save Login</Button>
                    </div>
                </div>
                <div>{this.state.successMessage}{this.state.validationError}</div>
            </div>
        );
    else
        return null;
  }
}

export default Logup;
