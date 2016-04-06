'use strict';

import React                        from 'react';
import superagent                   from 'superagent';
import config                       from 'syn/../../public.json';
import Component                    from '../lib/app/component';
import Modal                        from './util/modal';
import Form                         from './util/form';
import Button                       from './util/button';
import Submit                       from './util/submit';
import ButtonGroup                  from './util/button-group';
import Icon                         from './util/icon';
import Link                         from './util/link';
import Row                          from './util/row';
import Column                       from './util/column';
import EmailInput                   from './util/email-input';
import Password                     from './util/password';
import InputGroup                   from './util/input-group';
import Loading                      from './util/loading';
import Facebook                     from '../lib/app/fb-sdk';

class Join extends React.Component {

  constructor (props) {
    super(props);

    this.state = { validationError : null, successMessage : null, info : null };
  }

  signup () {
    let email = React.findDOMNode(this.refs.email).value,
      password = React.findDOMNode(this.refs.password).value,
      confirm = React.findDOMNode(this.refs.confirm).value,
      agree = React.findDOMNode(this.refs.agree);

    this.setState({ validationError : null, info : 'Logging you in...' });

    if ( password !== confirm ) {
      this.setState({ validationError : 'Passwords do not match', info: null });

      return;
    }

    if ( ! agree.classList.contains('fa-check-square-o') ) {
      this.setState({ validationError : 'Please agree to our terms of service', info: null });

      return;
    }

    superagent
      .post('/sign/up')
      .send({ email, password })
      .end((err, res) => {
        switch ( res.status ) {
          case 401:
            this.setState({ validationError : 'This email address is already taken', info: null });
            break;

          case 200:
            this.setState({ validationError : null, successMessage : 'Welcome aboard!', info: null });
            //location.href = '/page/profile';
            location.href = '/';
            break;

          default:
            this.setState({ validationError : 'Unknown error', info: null });
            break;
        }

        // location.href = '/';
      });
  }

  signIn (e) {
    e.preventDefault();

    this.props.login();
  }

  loginWithFacebook () {
    // location.href = '/sign/in/facebook/';
    Facebook.connect();
  }

  loginWithTwitter () {
    location.href = '/sign/in/twitter/';
  }

  agree () {
    let box = React.findDOMNode(this.refs.agree);

    if ( box.classList.contains('fa-square-o') ) {
      box.classList.remove('fa-square-o');
      box.classList.add('fa-check-square-o');
    }
    else {
      box.classList.add('fa-square-o');
      box.classList.remove('fa-check-square-o');
    }
  }

  static click () {
    document.querySelector('.syn-top_bar-join_button button').click();
  }

  render () {
    let classes = [ 'syn-join' ];

    if ( this.props.show ) {
      classes.push('syn--visible');
    }

    let content = (
      <div>
        <ButtonGroup block>
          <Button primary onClick={ this.loginWithFacebook } medium className="join-with-facebook">
            <Icon icon="facebook" />
            <span className={ Component.classList(this) } inline> Facebook</span>
          </Button>

          <Button info onClick={ this.loginWithTwitter } medium className="join-with-twitter">
            <Icon icon="twitter" />
            <span> Twitter</span>
          </Button>
        </ButtonGroup>

        <div className="syn-form-group">
          <label>Email</label>
          <EmailInput block autoFocus medium required placeholder="Email" ref="email" name="email" />
        </div>

        <Row>
          <Column span="50">
            <div className="syn-form-group">
              <label>Password</label>

            </div>
          </Column>

          <Column span="50">
            <div className="syn-form-group">
              <label>Confirm password</label>

            </div>
          </Column>

        </Row>

        <InputGroup block>
          <Password required placeholder="Password" ref="password" medium name="password" />
          <Password required placeholder="Confirm password" ref="confirm" medium name="confirm" />
        </InputGroup>



        <Row data-stack="phone-and-down">
          <Column span="50" gutter>
            Already a user? <a href="" onClick={ this.signIn.bind(this) }>Sign in</a>
          </Column>

          <Column span="50" text-right gutter>
            <Icon icon="square-o" size="2" onClick={ this.agree.bind(this) } ref="agree" name="agree" /> I agree to the <a href="/page/terms-of-service">Terms of Service</a>
          </Column>
        </Row>

        <div className="syn-form-group syn-form-submit">
          <Submit block large success radius>Join</Submit>
        </div>
        
      </div>
    );

    if ( this.state.info ) {
      content = ( <Loading message="Signing you in ..." /> );
    }

    else if ( this.state.successMessage ) {
      content = ( <div></div> );
    }

    return (
      <Modal className={ Component.classList(this, ...classes) } title="Join">
        <Form handler={ this.signup.bind(this) } flash={ this.state } form-center name="join">
          { content }
        </Form>
      </Modal>
    );
  }
}

export default Join;
