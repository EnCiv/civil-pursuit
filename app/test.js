'use strict';

import Mungo from 'mungo';
import User from './models/user';

// Mungo.connect(process.env.MONGO_TEST)
Mungo.connect(process.env.MONGOHQ_URL)
  .on('connected', () => {
    console.log('cool');

    User.findOne({ email : 'foo@foo.com' })
  });
