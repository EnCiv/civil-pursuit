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

class Login extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = { validationError : null, successMessage : null, info : null };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  login () {

    this.setState({ validationError : null, info : 'Logging you in...' });

    let email = React.findDOMNode(this.refs.email).value,
      password = React.findDOMNode(this.refs.password).value;

    superagent
      .post('/sign/in')
      .send({ email, password })
      .end((err, res) => {
        switch ( res.status ) {
          case 404:
            this.setState({ validationError : 'Wrong email', info: null });
            break;

            case 401:
              this.setState({ validationError : 'Wrong password', info: null });
              break;

            case 200:
              this.setState({ validationError : null, info: null, successMessage : 'Welcome back' });
              location.href = '/page/profile';
              break;

            default:
              this.setState({ validationError : 'Unknown error', info: null });
              break;
        }

        // location.href = '/';
      });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  signUp (e) {
    e.preventDefault();

    this.props.join();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  forgotPassword (e) {
    e.preventDefault();

    this.props['forgot-password']();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loginWithFacebook () {
    location.href = '/sign/facebook';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loginWithTwitter () {
    location.href = '/sign/twitter';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let classes = [ 'syn-login' ];

    if ( this.props.show ) {
      classes.push('syn--visible');
    }

    let content = (
      <div>
      <ButtonGroup block>
        <Button medium primary onClick={ this.loginWithFacebook }>
          <Icon icon="facebook" />
          <span className={ Component.classList(this) } inline> Facebook</span>
        </Button>

        <Button medium info onClick={ this.loginWithTwitter }>
          <Icon icon="twitter" />
          <span> Twitter</span>
        </Button>
      </ButtonGroup>

      <div className="syn-form-group">
        <label>Email</label>
        <EmailInput block autoFocus required medium placeholder="Email" ref="email" />
      </div>

      <div className="syn-form-group">
        <label>Password</label>
        <Password block required placeholder="Password" ref="password" medium />
      </div>

      <div className="syn-form-group syn-form-submit">
        <Submit block large success radius>Login</Submit>
      </div>

      <Row data-stack="phone-and-down">
        <Column span="50" gutter>
          Not yet a user? <a href="#" onClick={ this.signUp.bind(this) }>Sign up</a>
        </Column>

        <Column span="50" text-right gutter>
          Forgot password? <a href="#" onClick={ this.forgotPassword.bind(this) }>Click here</a>
        </Column>
      </Row>
      </div>
    );

    if ( this.state.info ) {
      content = ( <Loading message="Loggin you in..." /> );
    }

    else if ( this.state.successMessage ) {
      content = ( <div></div> );
    }

    return (
      <Modal className={ Component.classList(this, ...classes) } title="Login">
        <Form handler={ this.login.bind(this) } flash={ this.state } form-center>
          { content }
        </Form>
      </Modal>
    );
  }
}

export default Login;
