'use strict';

import Mungo from 'mungo';
import AppError from '../models/app-error';

const mongodbUrl = process.env.MONGOHQ_URL;

Mungo.connect(mongodbUrl)
  .on('connected', conn => {
    AppError.remove()
      .then(() => {
        console.log('errors cleared!');
        process.exit(0);
      })
      .catch(error => {
        console.log(error.stack);
        process.exit(1);
      });
  });
