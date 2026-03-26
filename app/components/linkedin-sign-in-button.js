// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { Button } from './button'
import LinkedInIcon from '../svgr/linkedin-icon'

export default function LinkedInSignInButton({ returnPath, children = 'Sign in with LinkedIn', className, disabled = false, ...otherProps }) {
  const classes = useStyles()

  const handleClick = () => {
    const path = returnPath || window.location.pathname + window.location.search
    window.location.href = '/linkedinAuth?return=' + encodeURIComponent(path)
  }

  return (
    <Button className={cx(classes.linkedInButton, className)} onDone={handleClick} disabled={disabled} noPendingClick {...otherProps}>
      <LinkedInIcon className={classes.icon} />
      {children}
    </Button>
  )
}

const useStyles = createUseStyles({
  linkedInButton: {
    backgroundColor: '#0A66C2',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '0.125rem solid #0A66C2',
    borderRadius: '1.5rem',
    padding: '0.5rem 1rem',
    '&:not([aria-disabled="true"]):hover': { backgroundColor: '#004182', borderColor: '#004182' },
    '&[aria-disabled="true"]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  icon: { width: '1.25rem', height: '1.25rem', flexShrink: 0 },
})
