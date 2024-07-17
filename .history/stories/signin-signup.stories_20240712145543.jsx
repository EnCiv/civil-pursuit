// https://github.com/EnCiv/civil-pursuit/issues/150

// Storybook is run on an express server, and this middleware fill lets routes be added
// To test the useAuth and AuthForm component we need to handle the post request and give a response

const express = require('express')

async function signInHandler(req, res) {
  const { email, password } = req.body
  if (email === 'success@email.com') {
    if (password === 'password') {
      res.send({ userId: 'abc123', firstName: 'Jane', lastName: 'Doe' })
    } else {
      res.statusCode = 404
      res.json({ 'user/password error': email })
      return
    }
  } else {
    res.statusCode = 404
    res.json({ 'user/password error': email })
    return
  }
}

async function signUpHandler(req, res) {
  console.info('body', req.body)
  const { email, password } = req.body
  if (email === 'success@email.com') {
    if (password === 'password') {
      res.send({ userId: 'abc123', firstName: 'Jane', lastName: 'Doe' })
    } else {
      res.statusCode = 404
      res.json({ 'user/password error': email })
      return
    }
  } else {
    res.statusCode = 404
    res.json({ 'user/password error': email })
    return
  }
}

async function tempId(req, res) {
  console.info('tempId body', req.body)
  let { password, ..._body } = req.body // don't let the password show up in the logs
  let { email } = req.body

  if (email === 'success@email.com' || !email) {
    res.send({ userId: 'abc123', email })
  } else {
    res.statusCode = 404
    res.json({ 'user/password error': email })
  }
}

const expressMiddleWare = router => {
  router.use(express.json())
  router.use(express.urlencoded({ extended: true }))
  router.post('/sign/in', signInHandler)
  router.post('/sign/up', signUpHandler)
  router.post('/tempid', tempId)
}
module.exports = expressMiddleWare

// import React from 'react'
// import SignInSignUp from '../app/components/signin-signup.jsx'
// import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
// import Login from '../app/components/login.jsx'

// export default {
//   component: SignInSignUp,
//   args: {},
//   decorators: [
//     Story => (
//         <div>
//             success@email.com / 'password' will succeed
//             <br />
//             all other combinations will fail
//             <Story />
//             </div>
//         ),
//     ],
//   parameters: {
//     viewport: {
//         viewports: INITIAL_VIEWPORTS
//     }
//   }
// }


// export const empty = {
//     args: {}
// }

// export const SignUp = {
//     args: {
//         startTab: 'Sign Up'
//     }
// }

// export const LogIn = {
//     args: {
//         startTab: 'Log In'
//     }
// }

// export const Mobile = {
//     parameters: {
//         viewport: {
//             defaultViewport: 'iphonex',
//         }
//     },
//     args: {}
// }

// export const LogInSuccess = {
//     args: {
//         startTab: 'login',
//         children: <Login email={'success@email.com'} password={'password'}/>
//     }
// }


// export const DestinationHomeString = mC({ destination: '/?path=/story/app--home' })
// export const DestinationHomeFunction = mC({ destination: value => (location.href = '/?path=/story/app--home') })