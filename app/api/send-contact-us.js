'use strict'

import sendEmail from '../server/util/send-email'

function sendContactUs(email, fname, lname, subject, message, cb) {
  try {
    let request = {
      from: process.env.NODEMAILER_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: subject,
      text: message,
    }

    if (email) request.replyTo = fname + ' ' + lname + ' <' + email + '>'

    logger.info('sendContactUs', request)

    if (process.env.NODEMAILER_SERVICE) {
      let results = sendEmail(request)
      results.then(cb).catch(error => cb({ error: error.message }))
    } else {
      cb()
    }
  } catch (error) {
    logger.info('caught error trying to send-contact-us')
    return
  }
}

export default sendContactUs