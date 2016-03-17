'use strict';

import nodemailer from 'nodemailer';
import sequencer from 'promise-sequencer';
import secret from '../../../secret.json';

const transporter = nodemailer.createTransport({
  service : 'Zoho',
  auth: {
    user :  secret.email.user,
    pass :  secret.email.password
  }
});

function sendEmail (options = {}) {
  console.log('sending password', options);

  if ( process.env.NODE_ENV !== 'production' ) {
    return new Promise(pass => {
      console.log('Not sending emails when not in production');
      pass();
    });
  }

  return sequencer(
    ()        =>    sequencer.promisify(::transporter.sendMail),
    results   =>    new Promise((pass, fail) => {
      if ( results.response === '250 Message received' ) {
        pass();
      }
      else {
        fail(new Error(results.response));
      }
    })
  );
}

export default sendEmail;
