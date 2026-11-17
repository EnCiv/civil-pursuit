// https://github.com/EnCiv/civil-pursuit/issues/164
import React from 'react'
import { createUseStyles } from 'react-jss'

function Donate(props) {
  const {
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    title = 'Donate to EnCiv', // text to display on hover
    disabled = false,
    tabIndex = 0,
    disableOnClick = false, // if true, the button gets disabled after click and stays disabled - prevents resubmission
    value,
    type = 'button', // by default this is a button
    ...otherProps
  } = props

  const classes = buttonStyles()

  const handleClick = event => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onDone({ valid: true, value })
  }

  return (
    <a
      className={classes.buttonBase}
      href="https://www.pledge.to/organizations/82-5200967/enciv"
      tabIndex={tabIndex}
      title={title}
      aria-disabled={disabled}
      onClick={handleClick}
      {...otherProps}
    >
      Donate
    </a>
  )
}

const buttonStyles = createUseStyles(theme => ({
  buttonBase: {
    width: 'auto',
    height: 'auto',
    backgroundColor: `${theme.colors.encivYellow}`,
    borderRadius: '2rem',
    padding: '0.2rem 2rem',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    textAlign: 'center',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,.18)',
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: '0.125rem solid #343433',
      outlineOffset: '0.125rem',
    },
    '&[aria-disabled="true"]': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
}))

export default Donate
