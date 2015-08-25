'use strict';

import React          from 'react';
import superagent     from 'superagent';
import Component      from '../lib/app/component';
import Modal          from './util/modal';
import Form           from './util/form';
import Button         from './util/button';
import Submit         from './util/submit';
import ButtonGroup    from './util/button-group';
import Icon           from './util/icon';
import Link           from './util/link';
import Row            from './util/row';
import Column         from './util/column';
import EmailInput     from './util/email-input';
import Password       from './util/password';
import Loading        from './util/loading';

class ForgotPassword extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = { validationError : null, successMessage : null, info : null };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  sendResetPassword () {

    this.setState({ validationError : null, info : 'One moment...' });

    let email = React.findDOMNode(this.refs.email).value;

    window.socket.emit('send password', email);

    this.setState({ info : null, successMessage : 'Message sent! Please check your inbox' });
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let classes = [ 'syn-login' ];

    if ( this.props.show ) {
      classes.push('syn--visible');
    }

    let content = (
      <div>
        <div className="syn-form-group">
          <label>Email</label>
          <EmailInput block autoFocus required medium placeholder="Email" ref="email" />
        </div>

        <div className="syn-form-group syn-form-submit">
          <Submit block large success radius>Send me reset password email</Submit>
        </div>

        <Row data-stack="phone-and-down">
          <Column span="50" gutter>
            <a href="" onClick={ this.signUp.bind(this) }>Sign up</a>
          </Column>

          <Column span="50" text-right gutter>
            <a href="" onClick={ this.signIn.bind(this) }>Sign in</a>
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
        <Form handler={ this.sendResetPassword.bind(this) } flash={ this.state } form-center>
          { content }
        </Form>
      </Modal>
    );
  }
}

export default ForgotPassword;
