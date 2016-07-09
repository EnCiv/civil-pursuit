'use strict';

import sequencer          from 'promise-sequencer';
import User               from '../models/user';
import sendEmail          from '../lib/app/send-email';
import secret             from '../../secret.json';

function sendContactUs (email, fname, lname, subject, message, cb) {
  
  console.info("sendContatUs", email, fname, lname, subject, message);

    return(
            sendEmail({
              from      :   secret.email.user,
              to        :   "david@synaccord.com",
              subject   :   subject ,
              text      :   message
            })
            );
}

export default sendContactUs;
