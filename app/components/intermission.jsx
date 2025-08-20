// https://github.com/EnCiv/civil-pursuit/issues/137
import React, { useState, useEffect, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { PrimaryButton, SecondaryButton } from './button'
import Intermission_Icon from '../svgr/intermission-icon'
import StatusBox from '../components/status-box'
import DeliberationContext from './deliberation-context'

const Intermission = props => {
  const { className = '', onDone = () => {}, user, round } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useContext(DeliberationContext)
  const { lastRound, finalRound, uInfo = {} } = data

  const [validationError, setValidationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [email, setEmail] = useState('')

  const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  function setUserInfo(email, callback) {
    window.socket.emit('set-user-info', { email: email }, callback)
  }

  const handleEmail = () => {
    setValidationError('')
    setSuccessMessage('')
    if (!validateEmail(email)) {
      setValidationError('email address not valid')
    } else {
      setUserInfo(email, response => {
        if (response.error) {
          setValidationError(response.error)
        } else {
          window.socket.emit('send-password', email, window.location.pathname, response => {
            if (response && response.error) {
              let { error } = response

              if (error === 'User not found') {
                error = 'Email not found'
              }
              setValidationError(error)
            } else {
              setSuccessMessage('Success, an email has been sent to ' + email + '. Please check your inbox and follow the instructions to continue.')
            }
          })
        }
      })
    }
  }

  const roundCompleted = uInfo[round]?.finished
  const userIsRegistered = !!user?.email
  const nextRoundAvailable = round < lastRound
  const allRoundsCompleted = roundCompleted && round >= finalRound

  let valid
  let onNext
  let conditionalResponse
  if (!userIsRegistered) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Great! To continue we need to be able to invite you back. So now is the last change to associate your email with this discussion</div>
        <input type="text" className={classes.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Please provide your email" />
        <div className={classes.buttonContainer}>
          <PrimaryButton onClick={handleEmail} title="Invite me back" disabled={false} disableOnClick={false}>
            Invite me back
          </PrimaryButton>
        </div>
        {successMessage && <StatusBox className={classes.successMessage} status="done" subject={successMessage} />}
        {validationError && <StatusBox className={classes.errorMessage} status="error" subject={validationError} />}
      </>
    )
    valid = false
  } else if (allRoundsCompleted) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Wonderful, that concludes this deliberation. We will notify you when the conclusion is ready.</div>
      </>
    )
    valid = true
    onNext = () => location.replace('https://enciv.org/')
  } else if (!roundCompleted) {
    if (round === 0)
      conditionalResponse = (
        <>
          <div className={classes.headlineSmall}>Great! You've answered the question, when we get responses from more people, we will invite you back to continue the deliberation.</div>
        </>
      )
    else conditionalResponse = <div className={classes.headlineSmall}>There are not enough responses yet to proceed with round {round + 1}. When we hear from more people, we will invite you back to continue the deliberation.</div>
    valid = false
    onNext = () => location.replace('https://enciv.org/')
  } else if (nextRoundAvailable) {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>Would you like to continue onto Round {round + 1 + 1}, or come back tomorrow? Sometimes it’s good to take a break and come back with fresh eyes. We will send you an email reminder</div>
        <div className={classes.buttonContainer}>
          <PrimaryButton title="Yes, Continue" disabled={false} disableOnClick={false} onClick={() => onDone({ valid: true, value: 'continue' })}>
            Yes, Continue
          </PrimaryButton>
          <SecondaryButton title="Remind Me Later" disabled={false} disableOnClick={false} onClick={() => setSuccessMessage('We will send you a reminder email tomorrow')}>
            Remind Me Later
          </SecondaryButton>
        </div>
        {successMessage && <StatusBox className={classes.successMessage} status="done" subject={successMessage} />}
      </>
    )
    if (successMessage) {
      valid = true
      onNext = () => location.replace('https://enciv.org/')
    } else valid = false
  } else {
    conditionalResponse = (
      <>
        <div className={classes.headlineSmall}>{`Great you've completed Round ${round + 1}, we will send you an invite to continue the discussion after more people have made it this far.`}</div>
      </>
    )
    valid = true
    onNext = () => location.replace('https://enciv.org/')
  }

  useEffect(() => {
    onDone({ valid, value: 'continue', onNext })
  }, [valid])
  return (
    <div className={cx(classes.intermission, className)}>
      <div className={classes.iconContainer}>
        <Intermission_Icon className={classes.icon} />
      </div>
      {conditionalResponse}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  iconContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  icon: {
    width: '3.125rem',
    height: '2.89rem',
  },
  intermission: {
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
  },
  headlineSmall: {
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
  text: {
    fontWeight: '400',
    fontFamily: 'Inter',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.title,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
}))

export default Intermission
