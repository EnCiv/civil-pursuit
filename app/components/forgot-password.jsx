'use strict';

import React          from 'react';
import ReactDOM       from 'react-dom';
import Component      from '../lib/app/component';
import Modal          from './util/modal';
import Form           from './util/form';
import Submit         from './util/submit';
import Row            from './util/row';
import Column         from './util/column';
import EmailInput     from './util/email-input';
import Loading        from './util/loading';

class ForgotPassword extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    validationError : null,
    successMessage : null,
    info : null
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  sendResetPassword () {

    this.setState({ validationError : null, info : 'One moment...' });

    let email = ReactDOM.findDOMNode(this.refs.email).value;

    window.socket.emit('send password', email, null, response => {
      if ( response.error ) {
        let { error } = response;

        if ( error === 'User not found' ) {
          error = 'Email not found';
        }

        this.setState({ info : null, validationError : error });
      }
      else {
        this.setState({ info : null, successMessage : 'Message sent! Please check your inbox' });
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  signUp (e) {
    e.preventDefault();

    this.props.join();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  signIn (e) {
    e.preventDefault();

    this.props.login();
  }

  stopPropagation(e){
    e.stopPropagation();
 }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let classes = [ 'syn-forgot-password' ];

    if ( this.props.show ) {
      classes.push('syn--visible');
    }

    let content = (
      <div onClick={this.stopPropagation.bind(this)}>
        <div className="syn-form-group">
          <label>Email</label>
          <EmailInput
            block
            autoFocus
            required
            medium
            placeholder           =   "Email"
            ref                   =   "email"
            name                  =   "email"
          />
        </div>

        <div className="syn-form-group syn-form-submit">
          <Submit
            block
            large
            success
            radius
          >
            Send a reset password email
          </Submit>
        </div>

        <Row data-stack="phone-and-down">
          <Column span="50" gutter>
            <a
              href            =   ""
              onClick         =   { ::this.signUp }
              className       =   "forgot-password-sign-up"
            >
              Sign up
            </a>
          </Column>

          <Column span="50" text-right gutter>
            <a
              href            =   ""
              onClick         =   { ::this.signIn }
              className       =   "forgot-password-sign-in"
            >
              Sign in
            </a>
          </Column>
        </Row>
      </div>
    );

    if ( this.state.info ) {
      content = ( <Loading message={ this.state.info } /> );
    }

    else if ( this.state.successMessage ) {
      content = ( <div></div> );
    }

    return (
      <Modal className={ Component.classList(this, ...classes) } title="Forgot password?">
        <Form
          handler             =   { this.sendResetPassword.bind(this) }
          flash               =   { this.state }
          name                =   "forgot-password"
          form-center
          ref                 = 'form'> 
          { content }
        </Form>
      </Modal>
    );
  }
}

export default ForgotPassword;
