'use strict';

import nodemailer from 'nodemailer';
import secret from '../../../secret.json';

function sendEmail (options = {}) {
  console.log('sending password', options);
  return new Promise((ok, ko) => {
    try {
      let transporter = nodemailer.createTransport({
        service : 'Zoho',
        auth: {
          user :  secret.email.user,
          pass :  secret.email.password
        }
      });

      transporter.sendMail(options, (error, results) => {
        if ( error ) {
          return ko(error);
        }
        if ( results.response === '250 Message received' ) {
          ok();
        }
        else {
          ko(new Error(results.response));
        }
      });
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default sendEmail;
