'use strict';

import Mung from 'mung';
import User from './models/user';

// Mung.connect(process.env.MONGO_TEST)
Mung.connect(process.env.MONGOHQ_URL)
  .on('connected', () => {
    console.log('cool');

    User.findOne({ email : 'foo@foo.com' })
  });
