'use strict';

import React from 'react';

class UserStore extends React.Component {
  constructor(props){
    super(props);
    this.state.actions['reset password']=this.resetPassword.bind(this);
  }

  state = {
    user                  :   null,
    actions               :   {}
  };

  componentDidMount() {
    window.socket.emit('get user info',
      this.props.user,
      user => { this.setState({ user })}
    );
  }

  componentWillUnmount() {
  }

  resetPassword (password, cb) {
    const { user } = this.state;

    window.socket.emit(
      'reset password',
      user.activation_key,
      user.activation_token,
      password,
      cb
    );
  }

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, this.state)
    );
  }

  render () {
    return (
      <section className="syn-user">
        { this.renderChildren() }
      </section>
    );
  }
}

export default UserStore;
