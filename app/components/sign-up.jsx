// https://github.com/EnCiv/civil-pursuit/issues/150
//https://github.com/EnCiv/civil-pursuit/issues/262

import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { useAuth } from 'civil-client'
import { Button } from './button'
import StatusBox from '../components/status-box'

function SignUp(props, ref) {
  const { className, style, onDone = () => {}, startTab = 'login', submitted = false, tabIndex = 0, ...otherProps } = props

  // checks if start tab requests login or sign up page
  const [isLogIn, setIsLogIn] = useState(startTab.toLowerCase().includes('up') ? false : startTab.toLowerCase().includes('in') ? true : false)
  // checks if user has pressed signed up or logged in button yet
  const [isSubmitted, setIsSubmitted] = useState(submitted)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // these variables are here to ensure empty fields dont turn red when user first loads in page
  const [clickedOnFirst, setClickedOnFirst] = useState(false)
  const [clickedOnLast, setClickedOnLast] = useState(false)
  const [clickedOnEmail, setClickedOnEmail] = useState(false)
  const [clickedOnPassword, setClickedOnPassword] = useState(false)
  const [clickedOnConfirm, setClickedOnConfirm] = useState(false)

  const { destination, userInfo = {} } = props
  const classes = useStyles()
  const [state, methods] = useAuth(destination, userInfo)

  // taken from button.jsx
  const handleKeyDown = (e, type, index) => {
    e.stopPropagation()
    // if space key is pressed
    if (e.keyCode === 32) {
      if (type === 'menu') {
        handleMouseLeave() // closes any dropdowns still open
      } else if (type === 'menuGroup') {
        handleMouseEnter(index)
      }
    }
  }

  // updates if the user has submitted the form and then calls the respective method
  function handleSubmit(page) {
    setIsSubmitted(true)
    if (page === 'signup') {
      methods.signup()
    } else if (page === 'login') {
      methods.login()
    }
  }

  function changeFirstName(value) {
    setClickedOnFirst(true)
    setFirstName(value)
  }

  function changeLastName(value) {
    setClickedOnLast(true)
    setLastName(value)
  }

  function changeEmail(value) {
    setClickedOnEmail(true)
    methods.onChangeEmail(value)
  }

  function changePassword(value) {
    setClickedOnPassword(true)
    methods.onChangePassword(value)
  }

  function changeConfirm(value) {
    setClickedOnConfirm(true)
    methods.onChangeConfirm(value)
  }

  // if user has filled out required fields, automatically log them in
  if (userInfo.email && userInfo.password) {
    useEffect(() => {
      onDone({ valid: true, value: userInfo })
      return
    })
  }

  // otherwise, continue showing login/sign up page
  return (
    <div className={cx(className, classes.SignUp)} style={style} ref={ref} {...otherProps}>
      <div className={classes.tabs}>
        <div className={cx(classes.tab, !isLogIn && classes.tabSelected)}>
          <Button onDone={e => setIsLogIn(false)} className={cx(classes.btnClick, !isLogIn && classes.btnClickSelected)} tabIndex="1">
            Sign Up
          </Button>
        </div>
        <div className={cx(classes.tab, isLogIn && classes.tabSelected)}>
          <Button onDone={e => setIsLogIn(true)} className={cx(classes.btnClick, isLogIn && classes.btnClickSelected)} tabIndex="1">
            Log In
          </Button>
        </div>
      </div>
      <div className={cx(classes.inputContainer, isLogIn ? classes.tabRightSelected : classes.tabLeftSelected)}>
        <div className={cx(classes.inputBoxes, !firstName && (clickedOnFirst || isSubmitted) && classes.invalid, isLogIn && classes.disabled)}>
          <p id="text">First Name</p>
          <input
            name="first-name"
            placeholder="John"
            className={cx(classes.input, !firstName && (clickedOnFirst || isSubmitted) && classes.invalidInput, isLogIn && classes.disabled)}
            onBlur={e => changeFirstName(e.target.value)}
            tabIndex={tabIndex}
          />
        </div>
        <div className={cx(classes.inputBoxes, isLogIn && classes.disabled, !lastName && (clickedOnLast || isSubmitted) && classes.invalid)}>
          <p id="text">Last Name</p>
          <input
            name="last-name"
            placeholder="Doe"
            className={cx(classes.input, isLogIn && classes.disabled, !lastName && (clickedOnLast || isSubmitted) && classes.invalidInput)}
            onBlur={e => changeLastName(e.target.value)}
            tabIndex={tabIndex}
          />
        </div>
        <div className={cx(classes.inputBoxes, !state.email && (clickedOnEmail || isSubmitted) && classes.invalid)}>
          <p id="text">E-mail</p>
          <input name="email" placeholder="Johndoe@gmail.com" className={cx(classes.input, !state.email && (clickedOnEmail || isSubmitted) && classes.invalidInput)} onBlur={e => changeEmail(e.target.value)} tabIndex={tabIndex} />
        </div>
        <div className={cx(classes.inputBoxes, !state.password && (clickedOnPassword || isSubmitted) && classes.invalid)}>
          <p id="text">Password</p>
          <input
            name="password"
            type="password"
            placeholder="******"
            className={cx(classes.input, !state.password && (clickedOnPassword || isSubmitted) && classes.invalidInput)}
            onChange={e => changePassword(e.target.value)}
            tabIndex={tabIndex}
          />
        </div>
        <div className={cx(classes.inputBoxes, isLogIn && classes.disabled, !state.password && (clickedOnConfirm || isSubmitted) && classes.invalid)}>
          <p id="text">Confirm Password</p>
          <input
            name="confirm"
            type="password"
            placeholder="******"
            className={cx(classes.input, !state.confirm && (clickedOnConfirm || isSubmitted) && classes.invalidInput, isLogIn && classes.disabled)}
            onChange={e => changeConfirm(e.target.value)}
            tabIndex={tabIndex}
          />
        </div>
        <div className={cx(classes.agreeTermContainer, isLogIn && classes.disabled)}>
          <div className={classes.checkTerm}>
            <input className={classes.checkTermBox} type="checkbox" name="agreed" onClick={e => methods.onChangeAgree(e.target.checked)} tabIndex={tabIndex} />
            <label className={classes.agreeTermLabel}>
              Yes, I agree to the
              <a href="https://enciv.org/terms" target="_blank" className={classes.aLinkTerm} tabIndex={tabIndex}>
                Terms of Service
              </a>
              and
              <a href="https://enciv.org/privacy" target="_blank" className={classes.aLinkTerm} tabIndex={tabIndex}>
                Privacy Policy.
              </a>
            </label>
          </div>
        </div>
        <StatusBox className={cx(classes.error, !state.error && classes.disabled)} status="error" subject={state.error} />
        <StatusBox className={cx(classes.info, !state.info && classes.disabled)} status="notice" subject={state.info} />
        <StatusBox className={cx(classes.success, !state.success && classes.disabled)} status="done" subject={state.success} />

        <div className={classes.btnContainer}>
          <Button className={cx(classes.btn, isLogIn && classes.disabled)} onDone={e => handleSubmit('signup')} tabIndex={tabIndex}>
            Sign Up
          </Button>
          <Button className={cx(classes.btn, !isLogIn && classes.disabled)} onDone={e => handleSubmit('login')} tabIndex={tabIndex}>
            Log In
          </Button>
          <Button className={cx(classes.btn, isLogIn && classes.disabled)} onDone={e => methods.skip()} tabIndex={tabIndex}>
            Skip
          </Button>
        </div>
        <div className={cx(classes.resetPasswordBtn, !isLogIn && classes.disabled)}>
          <Button onDone={e => methods.sendResetPassword()} className={classes.resetBtn} tabIndex={tabIndex}>
            Send Reset Password
          </Button>
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef(SignUp)

const useStyles = createUseStyles(theme => ({
  SignUp: {
    color: theme.colors.textPrimary,
    margin: 0,
    borderRadius: '1rem',
    padding: '0',
    fontFamily: 'Inter',
    fontSize: '1rem',
    fontWeight: '700',
    lineHeight: '1rem',
    textAlign: 'center',
    // position: 'fixed',
    overflowY: 'auto',
  },
  aLinkTerm: {
    marginLeft: '0.3rem', // add space
    marginRight: '0.3rem', // add space
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: theme.colors.mouseDownPrimeBlue,
    },
  },
  tabs: {
    width: '80%',
    height: '3rem',
    margin: 'auto',
    borderRadius: '5rem',
    border: '0.1rem solid',
    borderColor: theme.colors.borderGray,
    padding: '0.45rem 0.4rem 0 0.4rem ',
    boxShadow: ' 0.3rem 0.3rem 1rem 0.3rem rgba(0, 0, 0, 0.1)',
  },
  tab: {
    display: 'inline-block',
    position: 'relative',
    width: '50%',
    color: theme.colors.colorPrimary,
  },
  tabSelected: {
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5rem',
    background: theme.colors.tabSelected,
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    gap: '2rem',
  },
  btn: {
    borderRadius: '.5rem',
    border: '0.2rem solid',
    borderColor: theme.colors.primaryButtonBlue,
    backgroundColor: theme.colors.white,
    color: theme.colors.primaryButtonBlue,
    display: 'block',
    margin: '1rem auto',
    textAlign: 'center',
    width: '50%',
    '&:hover': {
      backgroundColor: theme.colors.primaryButtonBlue,
      borderColor: theme.colors.primaryButtonBlue,
      cursor: 'pointer',
      color: theme.colors.white,
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  },
  btnClick: {
    border: 'none',
    background: 'none',
    color: theme.colors.colorPrimary,
    width: '100%',
    borderRadius: '0.5rem',
    '&:hover': {
      background: 'none',
      borderColor: 'none',
      textDecoration: 'underline',
    },
    '&:focus': {
      border: `${theme.colors.focusOutline} solid 0.1rem`,
      borderRadius: '3rem',
    },
  },
  btnClickSelected: {
    color: theme.colors.primaryButtonBlue,
  },
  inputContainer: {
    margin: 0,
    padding: '2rem 0',
    borderRadius: '0 0 1rem 1rem',
    backgroundColor: theme.colors.white,
  },
  inputBoxes: {
    margin: '0 0.1rem',
    textAlign: 'left',
  },
  text: {
    margin: '0 0 1rem',
  },
  tabLeftSelected: {
    borderRadius: '0 1rem 1rem 1rem',
  },
  tabRightSelected: {
    borderRadius: '1rem 0 1rem 1rem',
  },
  input: {
    // '!important' to override from index.css
    width: '100%',
    background: '#FBFBFB',
    border: `solid 0.1rem ${theme.colors.borderGray} !important`,
    padding: '1rem !important',
    marginBottom: '2rem',
    borderRadius: '0.5rem !important',
    boxSizing: 'border-box !important',
    fontFamily: 'Inter',
    fontSize: '1rem',
    '&::placeholder': {
      color: theme.colors.inputFieldPlaceholder,
    },
    '&[type="password"]::placeholder': {
      color: theme.colors.passwordInputPlaceholder,
    },
  },
  invalid: {
    color: theme.colors.inputErrorBorder,
  },
  invalidInput: {
    border: '0.1rem solid red',
    backgroundColor: theme.colors.inputErrorContainer,
  },
  resetPasswordBtn: {
    width: '100%',
    margin: '2rem auto 1rem',
    cursor: 'pointer',
    textAlign: 'center',
  },
  resetBtn: {
    border: 'none',
    background: 'none',
    color: theme.colors.black,
    '&:hover': {
      background: 'none',
      borderColor: 'none',
      textDecoration: 'underline',
    },
  },
  agreeTermContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '2rem',
    margin: '0 auto',
  },
  checkTerm: {
    width: '100%',
    margin: '0 auto',
    textAlign: 'left',
    alignItems: 'left',
  },
  checkTermBox: {
    margin: 0,
    width: '1.5rem',
    height: '1.5rem',
    verticalAlign: 'middle',
  },
  agreeTermLabel: {
    width: '100%',
    marginLeft: '1rem',
    verticalAlign: 'middle',
  },
  error: {
    display: 'grid',
    width: '80%',
    color: theme.colors.black,
    backgroundColor: theme.colors.inputErrorContainer,
    border: '0.1rem solid ' + theme.colors.inputErrorBorder,
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    margin: '1rem auto',
    alignItems: 'center',
  },
  info: {
    width: '80%',
    color: theme.colors.black,
    border: '0.1rem solid ' + theme.colors.inputBorder,
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    margin: '1rem auto',
  },
  success: {
    width: '80%',
    color: theme.colors.black,
    backgroundColor: theme.colors.lightSuccess,
    border: '0.1rem solid ' + theme.colors.success,
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    margin: '1rem auto',
  },
  disabled: {
    display: 'none',
  },
}))
