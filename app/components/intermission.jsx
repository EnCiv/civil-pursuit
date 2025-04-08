// https://github.com/EnCiv/civil-pursuit/issues/137
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { PrimaryButton, SecondaryButton } from './button'
import Intermission_Icon from '../svgr/intermission-icon'
import StatusBox from '../components/status-box'

const Intermission = props => {
  const {
    className = '',
    user = {},
    round = 1, // the round that the user has just completed
    lastRound = 1,
    onDone = () => {},
    ...otherProps
  } = props
  const classes = useStylesFromThemeFunction(props)

  const [validationError, setValidationError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [email, setEmail] = useState('')

  const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  function setUserInfo(email, callback) {
    window.socket.emit('set-user-info', { email: email }, callback)
  }

  const handleEmail = () => {
    setValidationError(null)
    setSuccessMessage(null)
    if (!validateEmail(email)) {
      setValidationError('email address not valid')
    } else {
      setUserInfo(email, response => {
        if (response.error) {
          setValidationError(response.error)
        } else {
          setSuccessMessage('Email sent successfully!')
        }
      })
    }
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <div className={classes.iconContainer}>
        <Intermission_Icon className={classes.icon} />
      </div>
      <div className={classes.headline}>Awesome, you’ve completed Round {round}!</div>
      {Object.keys(user).length !== 0 ? (
        <>
          {round < lastRound ? (
            <>
              <div className={classes.headlinesmall}>Would you like to continue onto Round {round + 1}?</div>
              <div className={classes.buttonContainer}>
                <PrimaryButton title="Yes, Continue" disabled={false} disableOnClick={false} onClick={() => onDone({ valid: true, value: 'continue' })}>
                  Yes, Continue
                </PrimaryButton>
                <SecondaryButton title="Remind Me Later" disabled={false} disableOnClick={false} onClick={() => onDone({ valid: true, value: 'remind' })}>
                  Remind Me Later
                </SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <div className={classes.headlinesmall}>We will notify you when the next round is available.</div>
              <div className={classes.buttonContainer}>
                <PrimaryButton title="Continue" disabled={true} disableOnClick={false}>
                  Continue
                </PrimaryButton>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={classes.headlinesmall}>When more people have gotten to this point we will invite you back to continue the deliberation.</div>
          <input type="text" className={classes.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Please provide your email" />
          <div className={classes.buttonContainer}>
            <PrimaryButton onClick={handleEmail} title="Invite me back" disabled={false} disableOnClick={false}>
              Invite me back
            </PrimaryButton>
          </div>
          {successMessage && <StatusBox className={classes.successMessage} status="done" subject={successMessage} />}
          {validationError && <StatusBox className={classes.errorMessage} status="error" subject={validationError} />}
        </>
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  iconContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },
  icon: {
    width: '3.125rem',
    height: '2.89rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: '6rem',
      width: '100%',
    },
  },

  headline: {
    fontFamily: 'Inter',
    fontWeight: 300,
    fontSize: '2.25rem',
    lineHeight: '2.9375rem',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'left',
    // whiteSpace: 'nowrap',
  },

  headlinesmall: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '1.25rem',
    lineHeight: '1.875rem',
    color: theme.colors.disableTextBlack,
    textAlign: 'left !important',
  },
  input: {
    width: '100%',
    maxWidth: theme.colors.condensedWidthBreakPoint,
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '0.25rem',
    border: '0.0625rem solid #ccc',
    boxSizing: 'border-box',
  },

  checkboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-start',
  },

  checkboxWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },

  text: {
    fontWeight: '400',
    fontFamily: 'Inter',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.title,
  },
  underline: {
    textDecoration: 'underline',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  accountText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.disableTextBlack,
    textDecoration: 'underline',
  },
}))

export default Intermission
