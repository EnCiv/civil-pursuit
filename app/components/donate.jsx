// https://github.com/EnCiv/civil-pursuit/issues/164
import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from './button'
import cx from 'classnames'

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

  const handleKeyDown = e => {
    if (e.keyCode === 32) {
      e.stopPropagation()
      onDone({ valid: true, value })
    }
  }

  return (
    <a
      href="https://www.pledge.to/organizations/82-5200967/enciv"
      tabIndex={tabIndex}
      title={title}
      disabled={disabled}
      type={type}
      value={value}
      onKeyDown={handleKeyDown}
      {...otherProps}
    >
      <Button className={cx(classes.buttonBase)} children="Donate" />
    </a>
  )
}

const buttonStyles = createUseStyles(theme => ({
  buttonBase: {
    width: 'auto',
    height: 'auto',
    backgroundColor: `${theme.colors.encivYellow}`,
    borderRadius: '2rem',
    padding: '0.5rem 1.25rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    textAlign: 'center',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
  },
}))

export default Donate
