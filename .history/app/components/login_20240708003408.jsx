'use strict';

import React                          from 'react';
import superagent                     from 'superagent';
import Component                      from '../lib/app/component';
import Modal                          from './util/modal';
import Form                           from './util/form';
import Button                         from './util/button';
import Submit                         from './util/submit';
import ButtonGroup                    from './util/button-group';
import Icon                           from './util/icon';
import Row                            from './util/row';
import Column                         from './util/column';
import Input                          from './util/input';
import Loading                        from './util/loading';
import Facebook                       from '../lib/app/fb-sdk';

class Login extends React.Component {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = { validationError : null, successMessage : null, info : null };
    this.forgotPassword=this.forgotPassword.bind(this);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static signIn (email, password) {
    window.onbeforeunload=null; // stop the popup about navigating away
    return new Promise((ok, ko) => {
      try {
        superagent
          .post('/sign/in')
          .send({ email, password })
          .end((err, res) => {
            // if ( err ) {
            //   return ko(err);
            // }
            switch ( res.status ) {
              case 404:
                ko(new Error('Email not found'));
                break;

                case 401:
                  ko(new Error('Wrong password'));
                  break;

                case 200:
                  ok();
                  // location.href = '/page/profile';
                  break;

                default:
                  ko(new Error('Unknown error'));
                  break;
            }
          });
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  login () {

    this.setState({ validationError : null, info : 'Logging you in...' });

    let email = this.refs.email.value,
      password = this.refs.password.value;

    Login
      .signIn(email, password)
      .then(
        () => {
          this.setState({ validationError : null, info: null, successMessage : 'Welcome back' });
          setTimeout(() => location.href = window.location.pathname, 800); //'/page/profile'
        },
        error => {
          this.setState({ validationError : error.message, info: null })
        }
      );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  signUp (e) {
    //onsole.info("signup");
    e.preventDefault();

    this.props.join();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  forgotPassword (e) {
    //onsole.info("facebook");
    e.preventDefault();

    this.props['forgot-password']();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loginWithFacebook () {
    // location.href = '/sign/in/facebook';
    //onsole.info("loginWithFacebook");
    Facebook.connect();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loginWithTwitter () {
    location.href = '/sign/in/twitter';
  }


  stopPropagation(e){
    e.stopPropagation();
 }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let classes = [ 'syn-login' ];

    if ( this.props.show ) {
      classes.push('syn--visible');
    }

    let content = (
      <div onClick={this.stopPropagation.bind(this)}>
      {(this.socialMeida)?(
        <ButtonGroup block>
          <Button medium primary onClick={ this.loginWithFacebook } className="login-with-facebook" ref='facebook'>
            <Icon icon="facebook" />
            <span className={ Component.classList(this) }> Facebook</span>
          </Button>

          <Button medium info onClick={ this.loginWithTwitter } className="login-with-twitter">
            <Icon icon="twitter" />
            <span> Twitter</span>
          </Button>
        </ButtonGroup>
        ):null}

        <div className="syn-form-group">
          <label>Email</label>
          <Input type='email' block autoFocus required medium placeholder="Email" ref="email" name="email" />
        </div>

        <div className="syn-form-group">
          <label>Password</label>
          <Input type='password' block required placeholder="Password" ref="password" medium name="password" />
        </div>

        <div className="syn-form-group syn-form-submit">
          <Submit block large success radius>Login</Submit>
        </div>

        <Row>
          <Column span="50" gutter className="text-left">
            <p style={{margin: 0}}>Not yet a user?</p><a href="#" onClick={ this.signUp.bind(this) } ref='signup'>Sign up</a>
          </Column>

          <Column span="50" text-right gutter className="forgot-password">
            <p style={{margin: 0}} className="forgot-password-label">Forgot password?</p>
            <a
              href              =   "#"
              className         =   "forgot-password-link"
              onClick           = { this.forgotPassword }
            >
            Click here
            </a>
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
        <Form handler={ this.login.bind(this) } flash={ this.state } form-center name="login" ref='form'>
          { content }
        </Form>
      </Modal>
    );
  }
}

export default Login;
