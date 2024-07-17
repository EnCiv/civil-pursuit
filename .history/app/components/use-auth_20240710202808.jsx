import useMethods from 'use-methods'
import superagent from 'superagent'
import Isemail from 'isemail'

export function authenticateSocketIo(cb) {
  // after joining or loging in the socket needs to reconnect to get the authentication cookie in the header so it can be authenticated. Many api calls require the user to be authenticated
  if (typeof window !== 'undefined' && window.socket) {
    var reconnectFailed = setTimeout(() => {
      logger.error('Join.authenticateSocketIo timed out')
      cb && cb()
    }, 10 * 1000)
    const onConnect = () => {
      clearTimeout(reconnectFailed)
      window.socket.removeListener('connect', onConnect)
      cb && cb()
    }
    const onDisconnect = reason => {
      if (reason !== 'io client disconnect')
        logger.info('Join.authenticate unexpected disconnect reason:', reason, '... Continuing')
      window.socket.removeListener('disconnect', onDisconnect)
      window.socket.open()
    }
    window.socket.on('connect', onConnect)
    window.socket.on('disconnect', onDisconnect)
    window.socket.close()
  } else cb && cb()
}

function finish(res, onChange) {
  if (!onChange) authenticateSocketIo()
  else if (typeof onChange === 'function') authenticateSocketIo(() => onChange(JSON.parse(res.text)))
  else if (typeof onChange === 'string')
    setTimeout(() => {
      window.onbeforeunload = null // stop the popup about navigating away
      location.href = onChange
    }, 800)
  else logger.error('useAuth.finish unexpeced onChange', onChange, 'continuing')
}

function useAuth(onChange, userInfo = {}) {
  const [state, methods] = useMethods(
    (dispatch, state) => {
      return {
        authenticateSocketIo: authenticateSocketIo,
        onChangeAgree(agree) {
          dispatch({ agree: !!agree })
        },
        onChangeEmail(email) {
          if (email && !Isemail.validate(email, { minDomainAtoms: 2 }))
            dispatch({ email, error: 'email address is not valid', info: '', success: '' })
          else dispatch({ email, error: '', info: '', success: '' })
        },
        onChangePassword(password) {
          dispatch({ password })
        },
        onChangeConfirm(confirm) {
          dispatch({ confirm })
        },
        skip(cb) {
          let { agree, email } = state
          if (!agree) {
            dispatch({ error: 'Please agree to our terms of service', info: '', success: '' })
            return
          }
          if (email && !Isemail.validate(email, { minDomainAtoms: 2 })) {
            dispatch({ error: 'email address is not valid', info: '', success: '' })
            return
          }
          if (!email) email = undefined // '' causes a validation error on the server because Joi.string().email() can't be blank in the User schema
          // for skip - the password is just a unique signature
          let password = ''
          let length = Math.floor(Math.random() * 9) + 8 // the lenght will be between 8 and 16 characters
          for (; length > 0; length--) {
            password += String.fromCharCode(65 + Math.floor(Math.random() * 26)) // any character between A and Z
          }
          // had problem on safari and samsung browsers where password was empty -
          // added these checks but the problem went away - leaving the check in case it happens again
          if (!password || password.length < 8) loggger.error('skip password generation error', password)
          if (userInfo.password) logger.error('skip - userInfo.password was set')
          superagent
            .post('/tempid')
            .send({ ...userInfo, email, password }) // don't want children to see password -
            .end((err, res) => {
              if (err) logger.error('LoginStore.skip error', err)
              switch (res.status) {
                case 401:
                  dispatch({ error: 'This email address is already taken', info: '', success: '' })
                  break
                case 200:
                  dispatch({ error: '', success: 'Welcome aboard!', info: '' })
                  finish(res, cb || onChange)
                  break
                default:
                  dispatch({
                    error: 'unexpected error: ' + '(' + res.status + ') ' + (err || 'Unknown'),
                    info: '',
                    success: '',
                  })
                  break
              }
            })
        },

        login(cb) {
          const { email, password } = state
          superagent
            .post('/sign/in')
            .send({ ...userInfo, email, password })
            .end((err, res) => {
              if (err) logger.error('Join.login error', err)
              switch (res.status) {
                case 429:
                  dispatch({ error: res.text, info: '', success: '' })
                  return
                case 404:
                  dispatch({ error: "Email / Password Don't Match", info: '', success: '' }) // email not found but don't say that to the user
                  return
                case 401:
                  dispatch({ error: "Email / Password Don't Match", info: '', success: '' }) // Wrong Password but dont say that to the users
                  return
                case 200:
                  dispatch({ error: '', info: '', success: 'Welcome back' })
                  finish(res, cb || onChange)
                  return
                default:
                  dispatch({ error: 'Unknown error', info: '', success: '' })
                  return
              }
            })
          dispatch({ error: '', info: 'Logging you in...' })
        },

        signup(cb) {
          const { email, password, confirm, agree } = state
          if (password !== confirm) {
            dispatch({ error: 'Passwords do not match', info: '', success: '' })
            return
          }
          if (!agree) {
            dispatch({ error: 'Please agree to our terms of service', info: '', success: '' })
            return
          }
          if (!email) {
            dispatch({ error: 'email is missing', info: '', success: '' })
            return
          }
          if (!Isemail.validate(email, { minDomainAtoms: 2 })) {
            dispatch({ error: 'email not valid', info: '', success: '' })
            return
          }
          superagent
            .post('/sign/up')
            .send({ ...userInfo, email, password })
            .end((err, res) => {
              if (err) logger.error('useAuth.signup error', err)
              switch (res.status) {
                case 401:
                  dispatch({ error: 'This email address is already taken', info: '', success: '' })
                  break
                case 200:
                  dispatch({ error: '', info: '', success: 'Welcome aboard!' })
                  finish(res, cb || onChange)
                  break
                default:
                  dispatch({ error: 'Unknown error', info: '', success: '' })
                  break
              }
            })
        },

        sendResetPassword() {
          const { email } = state
          if (!email) {
            dispatch({ error: 'email is missing', info: '', success: '' })
            return
          }
          if (!Isemail.validate(email, { minDomainAtoms: 2 })) {
            dispatch({ error: 'email not valid', info: '', success: '' })
            return
          }
          dispatch({ error: '', info: 'One moment...', success: '' })
          window.socket.emit('send-password', email, window.location.pathname, response => {
            if (response && response.error) {
              let { error } = response

              if (error === 'User not found') {
                error = 'Email not found'
              }
              dispatch({ error, info: '', success: '' })
            } else {
              dispatch({ error: '', info: '', success: 'Message sent! Please check your inbox' })
            }
          })
        },
      }
    },
    { agree: false, error: '', success: '', info: '', email: '', password: '', confirm: '' }
  )
  return [state, methods]
}

export default useAuth