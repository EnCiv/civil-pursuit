'use strict'

import sequencer from 'promise-sequencer'
import User from '../models/user'
import sendEmail from '../server/util/send-email'
import Config from '../../public.json'

function sendPassword(email, return_to, cb) {
  const { host } = this.handshake.headers

  function emailBody(key, token) {
    const tail = token + (return_to || '')
    return Config.forgotPasswordEmail
      .replace(/\{key\}/g, key)
      .replace(/\{url\}/g, `http://${host}/page/reset-password/${tail}`)
  }

  new Promise((pass, fail) => {
    User.findOne({ email })

      .then(user =>
        new Promise((pass, fail) => {
          if (!user) {
            fail(new Error('User not found'))
          } else {
            sequencer(
              () => user.reactivate(),
              user =>
                sendEmail({
                  from: process.env.NODEMAILER_USER,
                  to: email,
                  subject: 'Reset password',
                  text: emailBody(user.activation_key, user.activation_token),
                })
            ).then(pass, fail)
          }
        }).then(pass, fail)
      )

      .catch(fail)
  })
    .then(cb)
    .catch(error => cb({ error: error.message }))
}

export default sendPassword
