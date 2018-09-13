'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import superagent from 'superagent';
import Accordion from 'react-proactive-accordion';

const styles=cssInJS({
    "buttonLink":{
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
        display: 'table-cell',
        overflow: 'hidden',
        'text-overflow': 'clip',
        width: '75%'
    },
    submit: {
        display: 'table-cell',
        overflow: 'hidden',
        'text-overflow': 'clip',
        width: '25%'
    },
    submitButton: {
        'padding': '.5em',
        'border-radius': '3px',
        'margin': '0',
        'width': "100%"
    },
    input: {
        width: "100%"

    },
    logout: {
        display: 'inline-block'
    },
    intro: {
        display: 'block',
        'text-align': 'left',
        'padding-bottom': '.5em'
    },
    info: {
        overflow: 'hidden',
        'text-overflow': 'clip',
        'text-align': 'left'
    },
    error: {
        color: 'red',
        overflow: 'hidden',
        'text-overflow': 'clip',
        'text-align': 'left'
    },
    box: {
        'border-color': 'gray',
        'border-width': '1px',
        'border-radius': '3px',
        'padding': '.5em',
        'margin': '.25em 0',
        'border-style': 'solid',
        'background-color': 'white',
    },
    buttonTable: {
        display: 'table',
        width: '100%'
    }
})

export default class LogoutSpan extends React.Component {
    constructor(props) {
        super(props);

        this.state = { error: null, info: null };
        this.logoutButton=this.logoutButton.bind(this);
        this.logup=this.logup.bind(this);
        this.detectCR=this.detectCR.bind(this);
    }

    logoutButton(e){
        if(this.props.user && (this.props.user.email || this.props.user.assignmentId )){
            location.href='/sign/out';
            return;
        }else
            this.setState({logup: !this.state.logup});
    }

    detectCR(e){
        if ( e.keyCode === 13 ) {
            e.preventDefault();
            this.logup();
        }
    }

    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    logup () {
        let email = ReactDOM.findDOMNode(this.refs.email).value;
        if(!LogoutSpan.validateEmail(email)){
            return this.setState({error: "email address not valid", info: null});
        } else {
            window.socket.emit('set user info', { email }, ()=>{
                this.setState({ error : null, info : 'Welcome, sending password reset email' },()=>{
                    window.socket.emit('send password', email, window.location.pathname, response => {
                        if ( response.error ) {
                            let { error } = response;
                    
                            if ( error === 'User not found' ) {
                            error = 'Email not found';
                            }
                    
                            this.setState({ info : null, error: error });
                        }
                        else {
                            this.setState({ error : null, info : 'Message sent! Please check your inbox' });
                        }
                        setTimeout(() => location.href = '/sign/out', 800); 
                    });
                });
            })
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        if(!this.props.user)
            return(null);
        else
            return (
                <div>
                    <button className={styles['buttonLink']} onClick={this.logoutButton}>{"Logout"}</button>
                    <Accordion active={this.state.logup} >
                        <div className={styles["box"]}>
                            <div className={styles['intro']}>If you logout now, this account will be lost.  Would you like to set an email address now?</div>
                            <div className={styles['buttonTable']}>
                                <div className={styles["email"]}>
                                    <input className={styles["input"]} placeholder="email" ref="email" name="email" type="email" onKeyDown={this.detectCR} />
                                </div>
                                <div className={styles["submit"]}>
                                    <button className={styles["input"]} className={styles["submitButton"]} onClick={this.logup}>Set email</button>
                                </div>
                            </div>
                            <div className={styles["info"]}>{this.state.info}</div>
                            <div className={styles["error"]}>{this.state.error}</div>
                            <div className={styles['info']}><button className={styles['buttonLink']} onClick={()=>{location.href='/sign/out'}}>{"Logout"}</button></div>
                        </div>
                    </Accordion>
                </div>
            );
    }
}

