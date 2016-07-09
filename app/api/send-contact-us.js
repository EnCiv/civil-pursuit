'use strict';

import sequencer          from 'promise-sequencer';
import User               from '../models/user';
import sendEmail          from '../lib/app/send-email';
import secret             from '../../secret.json';

function sendContactUs (email, fname, lname, subject, message, cb) {
  
  console.info("sendContatUs", email, fname, lname, subject, message);

    let results = sendEmail({
              from      :   secret.email.user,
              replyTo   :   fname + " " + lname + " <" + email + ">",
              to        :   "david@synaccord.com",
              subject   :   subject ,
              text      :   message
            });
    console.info("sendContactUs results", results);

    results.then(cb)
      .catch(error => cb({ error : error.message }));
}

export default sendContactUs;
