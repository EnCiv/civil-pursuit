'use strict';

import React                        from 'react';
import Form                         from './util/form';
import EmailInput                   from './util/email-input';
import TextInput                    from './util/text-input';
import Password                     from './util/password';
import Panel                        from './panel';
import Loading                      from './util/loading';
import Button                       from './util/button'
import InputGroup                   from './util/input-group';
import Login                        from './login';
import userType                     from '../lib/proptypes/user';

class ResetPassword extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    userToReset : userType,
    urlParams : React.PropTypes.shape({
      token : React.PropTypes.string
    })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = {
      user              : null,
      validationError   : null,
      successMessage    : null,
      info              : null
    };

    this.get();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get () {
    if ( typeof window !== 'undefined' && ! this.props.userToReset ) {
      window.Dispatcher.emit('get user', { activation_token : this.props.urlParams.token });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  save () {
    let password = React.findDOMNode(this.refs.password);
    let confirmPassword = React.findDOMNode(this.refs.confirmPassword);
    let resetKey = React.findDOMNode(this.refs.reset);

    this.setState({ validationError : null });

    if ( password.value !== confirmPassword.value ) {
      this.setState({ validationError : 'Passwords don\'t match' });
      return;
    }

    if ( resetKey.value !== this.props.userToReset.activation_key ) {
      this.setState({ validationError : 'Wrong reset key' });
      return;
    }

    window.Dispatcher.emit('reset password', this.props.userToReset, password.value);

    this.setState({ info : 'Resetting your password' });

    window.Dispatcher.on('password reset', () => {
      Login
        .signIn(this.props.userToReset.email, password.value)
        .then(
          () => {
            this.setState({ validationError : null, info: null, successMessage : 'Welcome back' });
            setTimeout(() => location.href = '/page/profile', 800);
          },
          ko => this.setState({ validationError : 'Wrong email', info: null })
        );
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let content = ( <Loading message="Getting user info" /> );

    if ( this.props.userToReset ) {

      let user = this.props.userToReset;

      let formContents;

      if ( ! this.state.info && ! this.state.successMessage ) {
        formContents = (
          <div>
            <h3 className="text-center">Your email</h3>

            <EmailInput block autoFocus required medium placeholder="Email" ref="email" disabled value={ user.email } />

            <h3 className="text-center">Your reset key</h3>

            <h5 className="text-center">Enter here the reset key that was sent to you by email</h5>

            <TextInput block medium ref="reset" required placeholder="Your reset key" />

            <h3 className="text-center">Enter a new password</h3>

            <InputGroup block>
              <Password required placeholder="Password" ref="password" medium />
              <Password required placeholder="Confirm password" ref="confirmPassword" medium />
            </InputGroup>

            <Button radius block medium primary style={{ marginTop : '10px' }} type="submit">Save new password</Button>
          </div>
        );
      }

      content = (
        <Form form-center style={{ margin : '10px' }} flash={ this.state } handler={ this.save.bind(this) }>
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
