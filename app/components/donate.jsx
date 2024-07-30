// https://github.com/EnCiv/civil-pursuit/issues/164
import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useNavigate } from 'react-router-dom'
import { PositioningPortal } from '@codastic/react-positioning-portal'
import cx from 'classnames'

function Donate(props) {
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    title = '', // text to display on hover
    disabled = false,
    tabIndex = 0,
    disableOnClick = false, // if true, the button gets disabled after click and stays disabled - prevents resubmission
    value,
    type = 'button', // by default this is a button
    children,
    ...otherProps
  } = props

  const classes = buttonStyles()
  const navigate = useNavigate()

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
      onDone({ valid: true, value })
      if (disableOnClick) setIsDisabled(true)
    }
  }

  const handleMouseLeave = e => {
    if (timeRef.current) clearTimeout(timeRef.current)
    timeRef.current = null
  }

  const handleKeyDown = e => {
    if (e.keyCode === 32) {
      e.stopPropagation()
      if (timeRef.current) clearTimeout(timeRef.current)
      timeRef.current = null
      onDone({ valid: true, value })
      if (disableOnClick) setIsDisabled(true)
    }
  }

  useEffect(() => {
    if (isPortalOpen) {
      const timeout = setTimeout(() => {
        setIsPortalOpen(false)
      }, displayTime)
      return () => clearTimeout(timeout)
    }
  }, [isPortalOpen, title.length])

  return (
    <PositioningPortal isOpen={isPortalOpen} portalContent={<span>{title}</span>}>
      <button
        className={cx(classes.buttonBase, className)}
        tabIndex={tabIndex}
        title={title}
        disabled={isDisabled}
        type={type}
        value={value}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        {...otherProps}
      >
        {children}
      </button>
    </PositioningPortal>
  )
}

export default React.forwardRef(Donate)
