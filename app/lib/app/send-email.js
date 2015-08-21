'use strict';

import nodemailer from 'nodemailer';
import secret from '../../../secret.json';

function sendEmail (options = {}) {
  return new Promise((ok, ko) => {
    try {
      let transporter = nodemailer.createTransport({
        service : 'Zoho',
        auth: {
          user :  secret.email.user,
          pass :  secret.email.password
        }
      });

      transporter.sendEmail(options, (error, results) => {
        if ( error ) {
          return ko(error);
        }
        console.log(results);
      });
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default sendEmail;
