'use strict';

import React                        from 'react';
import Form                         from './util/form';
import Input                        from './util/input';
import Panel                        from './panel';
import Button                       from './util/button'
import InputGroup                   from './util/input-group';
import userType                     from '../lib/proptypes/user';
import PropTypes from 'prop-types';

class ResetPassword extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    userToReset : userType,
    urlParams : PropTypes.shape({
      token : PropTypes.string
    })
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = {
      validationError   : (this.props.activation_token && this.props.activation_token === this.props.activation_key) ? null : "Reset Key Not Valid",
      successMessage    : null,
      info              : null
    };

    console.info("reset-password constructor");
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  save () {
    const password            =   this.refs.password.value;
    const confirmPassword     =   this.refs.confirmPassword.value;
    const resetKey            =   this.refs.reset.value;
    console.info("reset-password save");
    this.setState({ validationError : null });

    if ( password !== confirmPassword ) {
      this.setState({ validationError : 'Passwords don\'t match' });
      return;
    }

    if ( resetKey !== this.props.activation_key ) {
      this.setState({ validationError : 'Wrong reset key' });
      return;
    }

    this.setState({info: 'Resetting your password'}, ()=>{
      window.socket.emit('reset password', this.props.activation_key, resetKey, password, (result)=>{
        this.setState({ validationError : null, info: null, successMessage : 'Welcome back' }, ()=>{
          setTimeout(() => location.href = this.props.return_to || '/page/profile', 800);
        });
      })
    })
    
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("reset-password render");
    let content = ( <div style={{textAlign: 'center', padding: '1em 0', fontSize: "200%", color: "red"}}>Oops! Invalid key. Try sending a new forgot password email.</div> );

    const {activation_token}=this.props;

    if ( this.props.user ) {
      if(!this.props.user.email) // no user info
        return (
          <Panel title="Reset Password">
            <span>Missing email</span>
          </Panel>
        );
      let formContents;

      if ( ! this.state.info && ! this.state.successMessage ) {
        formContents = (
          <div style={{maxWidth: "30em", margin: 'auto'}}>
            <h3 className="text-center">Your email</h3>

            <Input type='email'
              block
              autoFocus
              required
              medium
              disabled
              placeholder                 =   "Email"
              ref                         =   "email"
              name                        =   "email"
              defaultValue                       =   { this.props.user.email }
            />

            <h3 className="text-center">Your reset key</h3>

            <h5 className="text-center">Enter here the reset key that was sent to you by email</h5>

            <Input type='text'
              block
              medium
              required
              ref                         =   "reset"
              name                        =   "reset"
              defaultValue                = {activation_token}
              placeholder                 =   "Your reset key"
            />

            <h3 className="text-center">Enter a new password</h3>

            <InputGroup block>
              <Input type='password'
                required
                medium
                placeholder               =   "Password"
                ref                       =   "password"
                name                      =   "password"
              />
              <Input type='password'
                required
                medium
                placeholder               =   "Confirm password"
                ref                       =   "confirmPassword"
                name                      =   "confirm-password"
              />
            </InputGroup>

            <Button radius block medium primary style={{ marginTop : '10px' }} type="submit">Save new password</Button>
          </div>
        );
      }

      content = (
        <Form
          form-center
          style                       =   {{ margin : '10px' }}
          flash                       =   { this.state }
          handler                     =   { this.save.bind(this) }
          name                        =   "reset-password"
        >
          { formContents }
        </Form>
      );
    }

    return (
      <Panel title="Reset password">
        { content }
      </Panel>
    );
  }
}

export default ResetPassword;
