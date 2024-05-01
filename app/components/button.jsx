// https://github.com/EnCiv/civil-pursuit/issues/43
import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { PositioningPortal } from '@codastic/react-positioning-portal'
import cx from 'classnames'

/**
 * Button component(without stretch goal version) that is styled using react-jss.
 * It supports various states like hover, active, and disabled,
 * and can be configured with custom styles, titles, and callbacks.
 *
 * @param {Object} props - The props for the Button component.
 */

function Button(props) {
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    title = '', // text to display on hover
    disabled = false,
    tabIndex = 0,
    disableOnClick = false, // if true, the button gets disabled after click and stays disabled - prevents resubmission
    children,
    ...otherProps
  } = props
  const displayTime = Math.max(8, 0.1 * title.length) * 1000
  const [isDisabled, setIsDisabled] = useState(disabled)
  const [isPortalOpen, setIsPortalOpen] = useState(false)
  const [downTimeStamp, setDownTimeStamp] = useState(0)
  const timeRef = useRef(null)

  const classes = buttonStyles()

  useEffect(() => {
    setIsDisabled(disabled)
  }, [disabled])

  const handleMouseDown = e => {
    e.stopPropagation()
    timeRef.current = setTimeout(() => {
      setIsPortalOpen(true)
    }, 500)
    setDownTimeStamp(e.timeStamp)
  }

  const handleMouseUp = e => {
    e.stopPropagation()
    if (timeRef.current) clearTimeout(timeRef.current)
    timeRef.current = null
    if (e.timeStamp - downTimeStamp < 500) {
      // short click
      onDone({ valid: true })
      if (disableOnClick) setIsDisabled(true)
    }
  }

  const handleMouseLeave = e => {
    if (timeRef.current) clearTimeout(timeRef.current)
    timeRef.current = null
  }

  useEffect(() => {
    if (isPortalOpen) {
      const timeout = setTimeout(() => {
        setIsPortalOpen(false)
      }, displayTime)
      return () => clearTimeout(timeout)
    }
  }, [isPortalOpen, title.length])

  // PositioningPortal doesn't put a tag around the button, so className and other props can be applied to the Button
  return (
    <PositioningPortal isOpen={isPortalOpen} portalContent={<span>{title}</span>}>
      <button
        className={cx(classes.buttonBase, className)}
        tabIndex={tabIndex}
        title={title}
        disabled={isDisabled}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...otherProps}
      >
        {children}
      </button>
    </PositioningPortal>
  )
}

function ModifierButton(props) {
  const { className, ...otherProps } = props
  const classes = buttonStyles()
  return <Button {...otherProps} className={cx(classes.modifierButton, className)} />
}

function SecondaryButton(props) {
  const { className, ...otherProps } = props
  const classes = buttonStyles()
  return <Button {...otherProps} className={cx(classes.secondaryButton, className)} />
}

function PrimaryButton(props) {
  const { className, ...otherProps } = props
  const classes = buttonStyles()
  return <Button {...otherProps} className={cx(classes.primaryButton, className)} />
}

function TextButton(props) {
  const { className, ...otherProps } = props
  const classes = buttonStyles()
  return <Button {...otherProps} className={cx(classes.textButton, className)} />
}

const buttonStyles = createUseStyles(theme => ({
  buttonBase: {
    // These are common styles
    width: 'auto',
    height: 'auto',
    borderRadius: '0.5rem',
    padding: '0.5rem 1.25rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    textAlign: 'center',
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
    // Add any other common styles here
  },

  secondaryButton: {
    extend: 'buttonBase',
    backgroundColor: theme.colors.white,
    color: theme.colors.primaryButtonBlue,
    border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,

    '&:disabled': {
      backgroundColor: theme.colors.white,
      color: theme.colors.disableGray,
      border: `0.125rem solid ${theme.colors.disableSecBorderGray}`,
      textDecoration: 'none',
      transition: 'none',
    },

    '&:hover, &.hover': {
      textDecoration: 'underline',
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.primaryButtonBlue,
    },

    '&:active': {
      backgroundColor: theme.colors.primaryButtonBlue,
      color: theme.colors.white,
      border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,
      textDecoration: 'none',
    },
  },

  modifierButton: {
    extend: 'buttonBase',
    backgroundColor: theme.colors.white,
    color: theme.colors.textBrown,
    border: `0.125rem solid ${theme.colors.encivYellow}`,

    '&:hover, &.hover': {
      textDecoration: 'underline',
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.encivYellow,
    },

    '&:active': {
      backgroundColor: theme.colors.encivYellow,
      color: theme.colors.textBrown,
      border: `0.125rem solid ${theme.colors.encivYellow}`,
      textDecoration: 'none',
    },
  },

  primaryButton: {
    extend: 'buttonBase',
    backgroundColor: theme.colors.primaryButtonBlue,
    color: theme.colors.white,
    border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,

    '&:disabled': {
      backgroundColor: theme.colors.borderGray,
      color: theme.colors.disableTextBlack,
      border: `0.0625rem solid ${theme.colors.borderGray}`,
      textDecoration: 'none',
      transition: 'none',
    },

    '&:hover, &.hover': {
      textDecoration: 'underline',
      backgroundColor: theme.colors.primaryButtonBlue,
      borderColor: theme.colors.primaryButtonBlue,
    },

    '&:active': {
      backgroundColor: theme.colors.mouseDownPrimeBlue,
      border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,
      textDecoration: 'none',
    },
  },

  textButton: {
    extend: 'buttonBase',
    backgroundColor: 'transparent',
    color: theme.colors.title,
    border: 'none',
    textAlign: 'left',
    textDecoration: 'underline',

    '&:hover, &.hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
      borderColor: 'none',
    },

    '&:active': {
      color: theme.colors.title,
      textDecoration: 'none',
    },
  },
}))

export { Button, ModifierButton, SecondaryButton, PrimaryButton, TextButton }
