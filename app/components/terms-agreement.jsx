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
    padding: '1.25rem',
    boxSizing: 'border-box',
    backgroundColor: theme.colors.white,
    border: `0.0625rem solid ${theme.colors.borderGray || theme.colors.inputBorder}`,
    borderRadius: '0.5rem',
    boxShadow: '0 0.25rem 0.75rem rgba(6, 51, 92, 0.08)',
  },
  checkTermContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  checkbox: {
    width: '1.25rem',
    height: '1.25rem',
    margin: 0,
    flexShrink: 0,
    cursor: 'pointer',
  },
  label: {
    flex: 1,
    fontSize: '1rem',
    lineHeight: '1.5',
    color: theme.colors.textPrimary || '#000',
    cursor: 'pointer',
  },
  link: {
    color: theme.colors.primaryButtonBlue,
    textDecoration: 'underline',
    textUnderlineOffset: '0.125rem',
    '&:hover': {
      color: theme.colors.mouseDownPrimeBlue,
    },
  },
  statusBox: {
    marginTop: '0.5rem',
  },
}))
