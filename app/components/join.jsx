'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import superagent from 'superagent';
import config from 'syn/../../public.json';
import Component from '../lib/app/component';
import Modal from './util/modal';
import Form from './util/form';
import Button from './util/button';
import Submit from './util/submit';
import ButtonGroup from './util/button-group';
import Icon from './util/icon';
import Link from './util/link';
import Row from './util/row';
import Column from './util/column';
import EmailInput from './util/email-input';
import Password from './util/password';
import InputGroup from './util/input-group';
import Loading from './util/loading';
import Facebook from '../lib/app/fb-sdk';

class Join extends React.Component {
  static click() {
    let modal = document.querySelector('.syn-join');
    modal.classList.add('syn--visible');
  }

  render() {
    let classes = ['syn-join'];

    if (this.props.show) {
      classes.push('syn--visible');
    }
    return (
      <Modal className={Component.classList(this, ...classes)} title="Join">
        <JoinForm {...this.props} />
      </Modal>
    );
  }
}

class JoinForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = { validationError: null, successMessage: null, info: null, joinActive: false, loginActive: false };
  }

  signup() {

    let email = ReactDOM.findDOMNode(this.refs.email).value,
      password = ReactDOM.findDOMNode(this.refs.password).value,
      confirm = ReactDOM.findDOMNode(this.refs.confirm).value,
      agree = ReactDOM.findDOMNode(this.refs.agree);

    this.setState({ validationError: null, info: 'Logging you in...' });

    if (password !== confirm) {
      this.setState({ validationError: 'Passwords do not match', info: null });

      return;
    }

    if (!agree.classList.contains('fa-check-square-o')) {
      this.setState({ validationError: 'Please agree to our terms of service', info: null });

      return;
    }

    window.onbeforeunload = null; // stop the popup about navigating away

    var userInfo=Object.assign({},this.props.userInfo, {email, password})

    superagent
      .post('/sign/up')
      .send(userInfo)
      .end((err, res) => {
        if (err) console.error("joinForm.signup error", err);
        switch (res.status) {
          case 401:
            this.setState({ validationError: 'This email address is already taken', info: null });
            break;

          case 200:
            this.setState({ validationError: null, successMessage: 'Welcome aboard!', info: null });
            if (this.props.onChange) setTimeout(() => this.props.onChange({ userId: JSON.parse(res.text).id }), 800);
            else setTimeout(() => location.href = this.props.newLocation ? this.props.newLocation : window.location.pathname, 800);
            break;

          default:
            this.setState({ validationError: 'Unknown error', info: null });
            break;
        }
      });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  skip() {

    let agree = ReactDOM.findDOMNode(this.refs.agree);

    this.setState({ validationError: null, info: 'Creating temporary account...' });

    if (!agree.classList.contains('fa-check-square-o')) {
      this.setState({ validationError: 'Please agree to our terms of service', info: null });
      return;
    }

    window.onbeforeunload = null; // stop the popup about navigating away

    var userInfo=Object.assign({},this.props.userInfo)

    let password='';
    let length=Math.floor(Math.random()*9)+8; // the lenght will be between 8 and 16 characters
    for(;length>0;length--){
      password+=String.fromCharCode(65+Math.floor(Math.random()*26)); // any character between A and Z
    }
    userInfo.password=password;

    superagent
      .post('/tempid')
      .send(userInfo)
      .end((err, res) => {
        if (err) console.error("joinForm.skip error", err);
        switch (res.status) {
          case 401:
            this.setState({ validationError: 'This email address is already taken', info: null });
            break;

          case 200:
            this.setState({ validationError: null, successMessage: 'Welcome aboard!', info: null });
            if (this.props.onChange) setTimeout(() => this.props.onChange({ userId: JSON.parse(res.text).id }), 800);
            else setTimeout(() => location.href = this.props.newLocation ? this.props.newLocation : window.location.pathname, 800);
            break;

          default:
            this.setState({ validationError: "unexpected error: " + '(' + res.status + ') ' + (err || 'Unknown'), info: null });
            break;
        }
      });
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  login() {

    this.setState({ validationError: null, info: 'Logging you in...' });

    let email = ReactDOM.findDOMNode(this.refs.email).value,
      password = ReactDOM.findDOMNode(this.refs.password).value;

    window.onbeforeunload = null; // stop the popup about navigating away

    var userInfo=Object.assign({},this.props.userInfo, {email, password}) // include any new user Info
    superagent
      .post('/sign/in')
      .send(userInfo)
      .end((err, res) => {
        if (err) console.error("joinForm.login error", err);
        var errorMsg = '';
        switch (res.status) {
          case 404:
            errorMsg = "Email / Password Don't Match";  // email not found but don't say that to the user
            break;

          case 401:
            errorMsg = "Email / Password Don't Match"; // Wrong Password but dont say that to the users
            break;

          case 200:
            this.setState({ validationError: null, info: null, successMessage: 'Welcome back' });
            if (this.props.onChange) setTimeout(() => this.props.onChange({ userId: JSON.parse(res.text).id }), 800);
            else setTimeout(() => location.href = this.props.newLocation ? this.props.newLocation : window.location.pathname, 800); //'/page/profile'
            return;

          default:
            errorMsg = 'Unknown error';
            break;
        }
        this.setState({ validationError: errorMsg, info: null })
      });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loginWithFacebook() {
    // location.href = '/sign/in/facebook/';
    //onsole.info("Join.loginWithFacebook");
    Facebook.connect();
  }

  loginWithTwitter() {
    location.href = '/sign/in/twitter/';
  }

  agree() {
    let box = ReactDOM.findDOMNode(this.refs.agree);

    if (box.classList.contains('fa-square-o')) {
      box.classList.remove('fa-square-o');
      box.classList.add('fa-check-square-o');
    }
    else {
      box.classList.add('fa-square-o');
      box.classList.remove('fa-check-square-o');
    }

    this.onChangeActive();
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  onChangeActive() {
    let email = ReactDOM.findDOMNode(this.refs.email).value,
      password = ReactDOM.findDOMNode(this.refs.password).value,
      confirm = ReactDOM.findDOMNode(this.refs.confirm).value,
      agree = ReactDOM.findDOMNode(this.refs.agree).classList.contains('fa-check-square-o'); // true if the box is checked

    if (!this.state.loginActive && email && password && !confirm) this.setState({ loginActive: true });
    if (this.state.loginActive && (!email || !password || confirm)) this.setState({ loginActive: false });
    if (!this.state.joinActive && email && password && confirm && password == confirm && agree) this.setState({ joinActive: true });
    if (this.state.joinActive && (!email || !password || !confirm || password != confirm || !agree)) this.setState({ joinActive: false });
  }



  render() {
    let content = (
      <div onClick={this.stopPropagation.bind(this)}>
        {(this.socialMedia) ? (
          <ButtonGroup block>
            <Button primary onClick={this.loginWithFacebook} medium className="join-with-facebook">
              <Icon icon="facebook" />
              <span className={Component.classList(this)}> Facebook</span>
            </Button>

            <Button info onClick={this.loginWithTwitter} medium className="join-with-twitter">
              <Icon icon="twitter" />
              <span> Twitter</span>
            </Button>
          </ButtonGroup> 
        ):null }

        <div className="syn-form-group">
          <label>Email</label>
          <EmailInput block autoFocus medium required placeholder="Email" ref="email" name="email" onChange={this.onChangeActive.bind(this)} />
        </div>

        <Row>
          <Column span="50">
            <div className="syn-form-group">
              <label>Password</label>

            </div>
          </Column>

          <Column span="50">
            <div className="syn-form-group">
              <label>Confirm</label>

            </div>
          </Column>

        </Row>

        <InputGroup block>
          <Password required placeholder="Password" ref="password" medium name="password" onChange={this.onChangeActive.bind(this)} />
          <Password required placeholder="Confirm password" ref="confirm" medium name="confirm" onChange={this.onChangeActive.bind(this)} />
        </InputGroup>



        <Row>
          <Column span="50" gutter className="text-left">
            <p style={{ margin: 0 }}>Already a user? Just Login</p>
          </Column>

          <Column span="50" text-right gutter>
            <a href="#" onClick={this.agree.bind(this)} style={{ textDecoration: 'none', color: 'inherit', float: 'left', marginLeft: '1em' }}>
              <Icon icon="square-o" size="2" ref="agree" name="agree" />
            </a>
            <span>I agree to the </span><a href="/page/terms-of-service">Terms of Service</a>
          </Column>
        </Row>

        <ButtonGroup block>
          <Button primary onClick={this.login.bind(this)} medium inactive={!this.state.loginActive} className="syn-form-group syn-form-submit login-button">
            <span className={Component.classList(this)}>Login</span>
          </Button>

          <Button info onClick={this.signup.bind(this)} medium inactive={!this.state.joinActive} className="syn-form-group syn-form-submit join-button">
            <span>Join</span>
          </Button>

          <Button info onClick={this.skip.bind(this)} medium className="syn-form-group syn-form-submit skip-button">
            <span>Skip</span>
          </Button>
        </ButtonGroup>

      </div>
    );

    if (this.state.info) {
      content = (<Loading message="Signing you in ..." />);
    }

    else if (this.state.successMessage) {
      content = (<div></div>);
    }

    return (
      <Form flash={this.state} ref='form' name="join">
        {content}
      </Form>
    );
  }
}

export default Join;
export { Join, JoinForm };

