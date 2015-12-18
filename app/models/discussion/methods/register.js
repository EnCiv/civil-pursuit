'use strict';

function register (user) {

  if ( this.registered.length >= this.goal ) {
    throw new Error('Goal already achieved');
  }

  const alreadyRegistered = this.registered.some(registeredUser => {
    if ( user._id ) {
      return registeredUser.toString() === user._id.toString();
    }
    return registeredUser.toString() === user.toString();
  });

  if ( alreadyRegistered ) {
    throw new Error('User already registered');
  }

  if ( Date.now() > +(this.deadline) ) {
    throw new Error('Discussion is closed');
  }

  if ( Date.now() < +(this.starts) ) {
    throw new Error('Discussion has not begun yet');
  }

  return this.push('registered', user);
}

export default register;
