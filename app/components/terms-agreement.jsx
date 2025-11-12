// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import StatusBox from './status-box'

/**
 * TermsAgreement - Displays Terms & Privacy checkbox for unauthenticated users
 *
 * This component is used within the Answer step to allow users to agree to Terms
 * before proceeding with the deliberation. It uses the useAuth hook's state and methods.
 *
 * Props:
 * - `state` - useAuth state object with agree, error, info, success properties
 * - `methods` - useAuth methods object with onChangeAgree function
 * - `onDone` - Optional callback function called when Terms agreement changes: `({ valid: boolean, value: number })`
 * - `className` - Optional className for styling
 * - `...otherProps` - Any other props are spread to the outer div
 */
function TermsAgreement({ state, methods, onDone = () => {}, className, ...otherProps }) {
  const classes = useStyles()

  const handleChange = e => {
    const checked = e.target.checked
    methods.onChangeAgree(checked)
    // Notify parent component of the change
    // value: 1 if checked, 0 if unchecked
    onDone({ agree: checked, valid: checked, value: checked ? 1 : 0 })
  }

  return (
    <div className={cx(classes.termsAgreement, className)} {...otherProps}>
      <div className={classes.checkTermContainer}>
        <input className={classes.checkbox} type="checkbox" id="terms-checkbox" checked={state.agree || false} onChange={handleChange} />
        <label htmlFor="terms-checkbox" className={classes.label}>
          Yes, I agree to the{' '}
          <a href="https://enciv.org/terms" target="_blank" rel="noopener noreferrer" className={classes.link}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="https://enciv.org/privacy" target="_blank" rel="noopener noreferrer" className={classes.link}>
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {state.error && <StatusBox className={classes.statusBox} status="error" subject={state.error} />}
      {state.info && <StatusBox className={classes.statusBox} status="notice" subject={state.info} />}
      {state.success && <StatusBox className={classes.statusBox} status="done" subject={state.success} />}
    </div>
  )
}

export default TermsAgreement

const useStyles = createUseStyles(theme => ({
  termsAgreement: {
    width: '100%',
    padding: '1rem 0',
    boxSizing: 'border-box',
  },
  checkTermContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  checkbox: {
    marginTop: '0.25rem',
    flexShrink: 0,
    cursor: 'pointer',
  },
  label: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: theme.colors.textPrimary || '#000',
    cursor: 'pointer',
  },
  link: {
    color: theme.colors.encivYellow || '#FFC315',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  statusBox: {
    marginTop: '0.5rem',
  },
}))
