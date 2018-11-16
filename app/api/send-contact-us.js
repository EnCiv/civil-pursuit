'use strict';

import sendEmail          from '../server/util/send-email';
import secret             from '../../secret.json';

function sendContactUs (email, fname, lname, subject, message, cb) {
    let request={
      from      :   secret.email.user,
      to        :   "david@synaccord.com",
      subject   :   subject ,
      text      :   message
    }

    if(email)
      request.replyTo=fname + " " + lname + " <" + email + ">";
  
    let results = sendEmail(request);

    results.then(cb)
      .catch(error => cb({ error : error.message }));
}

export default sendContactUs;
