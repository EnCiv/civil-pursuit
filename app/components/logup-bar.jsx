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
import Components from "./panel-components/";
import ListComponent from './list-component';
import setUserInfo                  from '../api-wrapper/set-user-info';


class Logup extends React.Component {
    
    state={validationError: null, successMessage: null }

    logup () {
        let email = ReactDOM.findDOMNode(this.refs.email).value;
        if ( email ) {
            setUserInfo( { email }, this.login.bind(this,email,this.props.user && this.props.user.tempid));
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

    getBannerNode(){
        return this.refs.banner;
      }

  render () {
    const { user, rasp } = this.props;
    const {children, ...lessProps} = this.props;
    const iconWidth=(typeof window !== 'undefined') ? window.Synapp.fontSize*2 : 13*2;
    const type= {
        _id: "SmallLayout",
        title: "Complete login",
        instruction: "A temporary Id has been assigned so you can continue in this discussion. This Id is stored in your browser (as a cookie). When you logout, it will be lost and un retrivable and your input will be eventually be deleted. When you set your email address your registration can be retreived using the forgot password link", 
      };
    if(user && user.id && !user.email)
        return (
            <div className="logup-bar" ref="banner">
                <div className="logup-bar-center">
                    <span className="logup-bar-title">Complete setup</span>
                    <div className="logup-bar-input">
                        <EmailInput autoFocus required placeholder="Email" ref="email" name="email" />
                    </div>
                    <div className="logup-bar-button">
                        <Button block large success radius onClick={this.logup.bind(this)}>Save</Button>
                    </div>
                    <ListComponent Components={Components} {...lessProps} type={type} component={'Instruction'} part={'button'} key={rasp.raspId + '-' + 'button'} position={0.5*iconWidth} />
                </div>
                <div>{this.state.successMessage}{this.state.validationError}</div>
                <div className="logup-bar-instruction">
                    <ListComponent Components={Components} {...lessProps} type={type} component={'Instruction'} part={'panel'} key={rasp.raspId + '-' + 'button'} position={0.5*iconWidth} />
                </div>
            </div>
        );
    else
        return null;
  }
}

export default Logup;
