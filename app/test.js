'use strict';

import Mung from './lib/mung';
import User from './models/user';

Mung.connect(process.env.MONGO_TEST)
  .on('connected', () => {
    console.log('cool');

    User.create({ email : Date.now().toString(), password : '1234' })
      .then(
        user => console.log(user.preferences),
        error => console.log(error.stack)
      );
  });
