'use strict';

function createDisposableUser () {
  return new Promise((ok, ko) => {
    let email = Math.random().toString() +
      process.pid.toString() +
      Date.now().toString() +
      '@synaccord.com';

    let disposable = {
      email       :   email,
      password    :   '1234'
    };

    this
      .create(disposable)
      .then(ok, ko);

  });
}

export default createDisposableUser;
