'use strict';

import UserModel from '../models/user';
import sendEmail from '../lib/app/send-email';
import secret from '../../secret.json';

function sendPassword (event, email) {
  try {
    UserModel
      .makePasswordResettable(email)
      .then(
        keys => {
          try {
            let $email  =   {
              from      :   secret.email.user,
              to        :   email,
              subject   :   'Reset password',
              text      :   secret['forgot password email']
                .replace(/\{key\}/g, keys.key)
                .replace(/\{url\}/g, 'http://' +
                  this.handshake.headers.host + '/page/reset-password?token=' + keys.token)
            };
            sendEmail($email)
              .then(
                () => {
                  this.ok(event);
                },
                this.error.bind(this)
              );
          }
          catch ( error ) {
            this.error(error);
          }
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default sendPassword;
