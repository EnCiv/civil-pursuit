'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import EmailInput from './util/email-input';
import Button from './util/button';
import Login from './login';
import Components from "./panel-components/";
import ListComponent from './list-component';
import setUserInfo                  from '../api-wrapper/set-user-info';


class Logup extends React.Component {

    state = { validationError: null, successMessage: null }

    logup() {
        let email = ReactDOM.findDOMNode(this.refs.email).value;
        if (!Logup.validateEmail(email)) {
            return this.setState({ validationError: "email address not valid", successMessage: null });
        } else
            setUserInfo({ email }, (info) => {
                Login.signIn(email, this.props.user.tempid)
                    .then(
                        () => {
                            this.setState({ validationError: null, successMessage: 'Welcome, sending password reset email' }, () => {
                                setTimeout(() => {
                                    window.socket.emit('send password', email, window.location.pathname, response => {
                                        if (response.error) {
                                            let { error } = response;

                                            if (error === 'User not found') {
                                                error = 'Email not found';
                                            }

                                            this.setState({ successMessage: null, validationError: error });
                                        }
                                        else {
                                            this.setState({ validationError: null, successMessage: 'Message sent! Please check your inbox' });
                                        }
                                        setTimeout(() => location.href = window.location.pathname, 800);
                                    });
                                }, 800);
                            });
                        },
                        error => {
                            this.setState({ validationError: error.message })
                        }
                    );
            });
    }

    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    getBannerNode() {
        return this.refs.banner;
    }

    render() {
        const { user, rasp } = this.props;
        const { children, ...lessProps } = this.props;
        const iconWidth = (typeof window !== 'undefined') ? window.Synapp.fontSize * 2 : 13 * 2;
        const type = {
            _id: "SmallLayout",
            title: "Complete login",
            instruction: "A temporary Id has been assigned so you can continue in this discussion. This Id is stored in your browser (as a cookie). When you logout, it will be lost and un retrivable and your input will be eventually be deleted. When you set your email address your registration can be retreived using the forgot password link",
        };
        if (user && user.id && !(user.email || user.assignmentId))
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
                        <ListComponent Components={Components} {...lessProps} type={type} component={'Instruction'} part={'button'} key={rasp.raspId + '-' + 'button'} position={0.5 * iconWidth} />
                    </div>
                    <div>{this.state.successMessage}{this.state.validationError}</div>
                    <div className="logup-bar-instruction">
                        <ListComponent Components={Components} {...lessProps} type={type} component={'Instruction'} part={'panel'} key={rasp.raspId + '-' + 'button'} position={0.5 * iconWidth} />
                    </div>
                </div>
            );
        else
            return null;
    }
}

export default Logup;
