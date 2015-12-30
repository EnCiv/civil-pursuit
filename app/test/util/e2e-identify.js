'use strict';

import User from '../../../models/user';

function identify(client) {
  const locals = {};

  client.foo = true;

  return it => {
    it('should create a User to sign in with', () => new Promise((ok, ko) => {
      User.lambda().then(
        user => {
          locals.user = user;
          ok();
        },
        ko
      );
    }));

    it('should set cookie', () => new Promise((ok, ko) => {
      client.setCookie({
        name : 'synuser',
        value :  JSON.stringify({
          id : locals.user._id
        })
      }).then(ok, ko);
    }));

    it('should refresh', () => client.refresh());
  };
}

export default identify;
