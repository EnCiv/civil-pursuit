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
 // LOL
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