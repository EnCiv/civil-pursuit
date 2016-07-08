'use strict';

import sequencer          from 'promise-sequencer';
import User               from '../models/user';
import sendEmail          from '../lib/app/send-email';
import secret             from '../../secret.json';

function sendContactUs (email, fname, lname, subject, message, cb) {
  const { host } = this.handshake.headers;
  console.info("sendContatUs",host, email, fname, lname, subject, message);

  new Promise((pass, fail) => {
            sendEmail({
              from      :   secret.email.user,
              to        :   "david@synaccord.com",
              subject   :   subject ,
              text      :   message
            });
  })
    .then(cb)
    .catch(error => cb({ error : error.message }));
}

export default sendContactUs;
