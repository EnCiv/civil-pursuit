'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import superagent from 'superagent';
import Accordion from 'react-proactive-accordion';
import cx from 'classnames';
import injectSheet from 'react-jss'

const styles={
    "login":{
        display: 'inline-block',
        padding: 0,
        background: 'inherit',
        border: 'none',
        'font-size': '1rem',
        color: '#5a94c5',

        ':hover': {
                'text-decoration': 'underline',
                background: 'inherit',
                border: 'none'
        }
    },
    "forgot":{
        display: 'inline-block',
        padding: 0,
        background: 'inherit',
        border: 'none',
        'font-size': '1rem',
        color: '#5a94c5',

        ':hover': {
                'text-decoration': 'underline',
                background: 'inherit',
                border: 'none'
        }
    },
    email: {
        display: 'inline-block',
        overflow: 'hidden',
        'text-overflow': 'clip',
        width: '43%'
    },
    password: {
        display: 'inline-block',
        overflow: 'hidden',
        'text-overflow': 'clip',
        width: '43%'
    },
    submit: {
        display: 'inline-block',
        overflow: 'hidden',
        'text-overflow': 'clip',
        width: '14%'
    },
    submitButton: {
        'padding': '.5em',
        'border-radius': '3px',
        'margin': '0'
    },
    input: {
        width: "100%"

    },
    logout: {
        display: 'inline-block'
    },
    info: {
        display: 'block',
        overflow: 'hidden',
        'text-overflow': 'clip',
        'text-align': 'left'
    },
    error: {
        display: 'block',
        color: 'red',
        overflow: 'hidden',
        'text-overflow': 'clip',
        'text-align': 'left'
    },
    box: {
        'border-color': 'gray',
        'border-width': '1px',
        'border-radius': '3px',
        'padding': '.25em',
        'margin': '.25em',
        'border-style': 'solid',
        'background-color': 'white'
    }
}

class LoginSpan extends React.Component {
    constructor(props) {
        super(props);

        this.state = { validationError: null, successMessage: null, info: null };
        this.loginButton=this.loginButton.bind(this);
        this.login=this.login.bind(this);
        this.detectCR=this.detectCR.bind(this);
        this.forgotPassword=this.forgotPassword.bind(this);
    }

    loginButton(e){
        this.setState({login: !this.state.login});
    }

    static signIn(email, password) {
        window.onbeforeunload = null; // stop the popup about navigating away
        return new Promise((ok, ko) => {
            try {
                superagent
                    .post('/sign/in')
                    .send({ email, password })
                    .end((err, res) => {
                        switch (res.status) {
                            case 404:
                                ko(new Error('Email not found'));
                                break;

                            case 401:
                                ko(new Error('Wrong password'));
                                break;

                            case 200:
                                ok();
                                break;

                            default:
                                ko(new Error('Unknown error'));
                                break;
                        }
                    });
            }
            catch (error) {
                ko(error);
            }
        });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    detectCR(e){
        if ( e.keyCode === 13 ) {
            e.preventDefault();
            this.login();
        }
    }

    login() {

        this.setState({ error: null, info: 'Logging you in...' },()=>{

            let email = ReactDOM.findDOMNode(this.refs.email).value,
                password = ReactDOM.findDOMNode(this.refs.password).value;

            if(!LoginSpan.validateEmail(email)){
                return this.setState({error: "email address not valid", info: null});
            } else if(!password.length) {
                return this.setState({error: "password required", info: null});
            } else {
                LoginSpan
                    .signIn(email, password)
                    .then(
                        () => {
                            this.setState({ error: null, info: 'Welcome back' });
                            setTimeout(() => location.href = window.location.pathname, 800);
                        },
                        error => {
                            this.setState({ error: error.message, info: null })
                        }
                    );
            }
        });
    }

    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    forgotPassword(e) {
        this.setState({ validationError : null, info : 'One moment...' },()=>{
            let email = ReactDOM.findDOMNode(this.refs.email).value;
            if(!LoginSpan.validateEmail(email)){
                return this.setState({error: "email address not valid", info: null});
            } else {
                window.socket.emit('send password', email, window.location.pathname, response => {
                    if ( response.error ) {
                        let { error } = response;
                
                        if ( error === 'User not found' ) {
                        error = 'Email not found';
                        }
                
                        this.setState({ info : null, error : error });
                    }
                    else {
                        this.setState({ info : 'Message sent! Please check your inbox', error: null });
                    }
                });
            }
        });
    }



    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const {classes, user}=this.props

        if(user)
            return(        
                <div className={cx(classes['logout'])}>
                    <a href="/sign/out">Logout</a>
                </div>
            )
        else
            return (
                <div>
                    <div style={{display: "table", width: "100%"}}>
                        <div style={{display: "table-cell", width: "25%"}}>
                            <button className={cx(classes['login'])} onClick={this.loginButton}>{this.state.login ? "Hide" : "Login"}</button>
                        </div>
                        <div style={{display: "table-cell", width: "75%"}}>
                            <span>{this.state.login ? "If you are new" : " if you have been here before"}</span>
                        </div>
                    </div>
                    <Accordion active={this.state.login} >
                        <div className={cx(classes["box"])}>
                            <div className={cx(classes["email"])}>
                                <input className={cx(classes["input"])} placeholder="email" ref="email" name="email" type="email" />
                            </div>
                            <div className={cx(classes["password"])}>
                                <input className={cx(classes["input"])} placeholder="Password" ref="password" type="password" name="password" onKeyDown={this.detectCR}/>
                            </div>
                            <div className={cx(classes["submit"])}>
                                <button className={cx(classes["input"])} className={cx(classes["submitButton"])} onClick={this.login}>Login</button>
                            </div>
                            <div>
                                <button className={cx(classes['forgot'])} onClick={this.forgotPassword}>Send login/forgot password link</button>
                            </div>
                            <div className={cx(classes["info"])}>{this.state.info}</div>
                            <div className={cx(classes["error"])}>{this.state.error}</div>
                        </div>
                    </Accordion>
                </div>
            );
    }
}

export default injectSheet(styles)(LoginSpan);