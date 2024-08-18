// https://github.com/EnCiv/civil-pursuit/issues/137
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { PrimaryButton, SecondaryButton } from './button'
import Intermission_Icon from '../svgr/intermission-icon'
const Intermission = props => {
  const {
    className = '',
    user = {},
    round = 1, // the round that the user has just completed
    ...otherProps
  } = props
  const classes = useStylesFromThemeFunction(props)

  const [validationError, setValidationError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [useremail, setUseremail] = useState(null)

  const validateEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }
  const handleEmail = () => {
    let email = user.email
    console.log(email)
    console.log(user.tempid)
    if (!validateEmail(email)) {
      setValidationError('email address not valid')
      setSuccessMessage(null)
      setUseremail(false)
    } else {
      setValidationError(null)
      setUseremail(true)
    }

    console.log(validationError)
    console.log(successMessage)
    console.log(useremail)
  }

  useEffect(() => {
    handleEmail()
  }, [user])

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <div className={classes.iconContainer}>
        <Intermission_Icon className={classes.icon} />
      </div>
      <div className={classes.headline}>Awesome, you’ve completed Round {round}!</div>
      {useremail ? (
        <>
          {round === 1 ? (
            <>
              <div className={classes.headlinesmall}>We will notify you when the next round is available.</div>
              <div className={classes.buttonContainer}>
                <PrimaryButton onClick={handleEmail} title="Continue" disabled={false} disableOnClick={false}>
                  Continue
                </PrimaryButton>
              </div>
            </>
          ) : (
            <>
              <div className={classes.headlinesmall}>Would you like to continue onto Round 2?</div>
              <div className={classes.buttonContainer}>
                <PrimaryButton onClick={handleEmail} title="Yes, Continue" disabled={false} disableOnClick={false}>
                  Yes, Continue
                </PrimaryButton>
                <SecondaryButton title="Remind Me Later" disabled={false} disableOnClick={false}>
                  Remind Me Later
                </SecondaryButton>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={classes.headlinesmall}>
            When more people have gotten to this point we will invite you back to continue the deliberation.
          </div>
          <input type="text" className={classes.input} placeholder="Please provide your email" />
          <div className={classes.checkboxContainer}>
            <div className={classes.checkboxWrapper}>
              <input type="checkbox" id="checkbox1" name="checkbox1" />
              <label htmlFor="checkbox1" className={classes.text}>
                By signing up, you agree to our Terms, Privacy Policy and Cookie use.
              </label>
            </div>
            <div className={classes.checkboxWrapper}>
              <input type="checkbox" id="reviewTerms" />
              <label htmlFor="reviewTerms" className={classes.text}>
                I have reviewed the <span className={classes.underline}>Terms, Privacy Policy and Cookie</span> use.
              </label>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <PrimaryButton onClick={handleEmail} title="Invite me back" disabled={false} disableOnClick={false}>
              Invite me back
            </PrimaryButton>
            <div className={classes.accountText}>Already have an account?</div>
          </div>
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
    width: '33.9375rem',

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
    color: '#343433',
    textAlign: 'left !important',
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
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
    color: '#1A1A1A',
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
    color: '#343433',
    textDecoration: 'underline',
  },
}))

export default Intermission
