'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { forwardRef, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { PositioningPortal } from '@codastic/react-positioning-portal/lib/legacy/index.js'

const Step = forwardRef((props, ref) => {
  const { name, title = '', complete, active, unlocked, onDone = () => {}, index, stepIndex, className, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  // how long the title will be displayed when longpress is triggered
  const displayTime = Math.max(8, 0.1 * title.length) * 1000
  // state to manage open status of the portal
  const [isPortalOpen, setIsPortalOpen] = useState(false)
  // reference to hold timeout variable throughout lifetime of the component
  const timeRef = useRef(null)

  const containerStyle = cx(
    classes.buttonFocus,
    classes.sharedContainerStyles,
    {
      [classes.containerActive]: active,
      [classes.containerInactiveComplete]: !active,
    },
    className
  )

  const textStyle = cx(classes.sharedTextStyles, {
    [classes.stepTextActive]: (active && !complete) || (!active && complete) || (!active && !complete && unlocked),
    [classes.stepTextInactiveIncomplete]: !active && !complete && !unlocked,
  })

  // begin a timneout when the span wrapping the step is clicked
  const handleMouseDown = () => {
    timeRef.current = setTimeout(() => {
      setIsPortalOpen(true)
    }, 500)
  }

  // clear the timeout when the click is finished
  const handleMouseUp = event => {
    clearTimeout(timeRef.current)
    setTimeout(() => setIsPortalOpen(false), displayTime)
  }

  const handleKeyDown = e => {
    if (e.keyCode === 32) {
      e.stopPropagation()
      if (timeRef.current) clearTimeout(timeRef.current)
      timeRef.current = null
      if (complete || active || unlocked) onDone(index)
    }
  }

  useEffect(() => {
    // Set the timeout for the portal whenver it is opened.
    if (isPortalOpen) {
      const timeout = setTimeout(() => {
        setIsPortalOpen(false)
      }, displayTime)
      return () => clearTimeout(timeout)
    }
  }, [isPortalOpen, title.length])

  return (
    <div
      className={containerStyle}
      onMouseUp={e => {
        e.stopPropagation()
        if (complete || active || unlocked) onDone(index)
      }}
      onKeyDown={handleKeyDown}
      title={`${title}`}
      tabIndex={complete || active || unlocked ? 0 : -1}
      data-testid="testClick"
      ref={complete || active || unlocked ? ref : null}
      {...otherProps}
    >
      <span onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <PositioningPortal isOpen={isPortalOpen} portalContent={<span>{title}</span>}>
          <div className={textStyle}>{stepIndex + ': ' + name}</div>
        </PositioningPortal>
      </span>
    </div>
  )
})

const useStylesFromThemeFunction = createUseStyles(theme => ({
  sharedContainerStyles: {
    padding: '0.625rem 0.9375rem',
    borderRadius: '0.625rem',
    overflow: 'hidden',
    cursor: 'default',
  },

  containerActive: {
    background: theme.colors.stepContainerActive,
    '&:hover $stepTextActive': {
      ...theme.enCivUnderline,
      cursor: 'pointer',
    },
  },

  containerInactiveComplete: {
    background: theme.transparent,
    '&:hover $stepTextActive': {
      ...theme.enCivUnderline,
      cursor: 'pointer',
    },
  },

  sharedTextStyles: {
    ...theme.font,
    textAlign: 'start',
    fontSize: '1.125rem',
    fontWeight: '600',
    lineHeight: '1.4375rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  stepTextActive: {
    color: theme.colors.primaryButtonBlue,
  },

  stepTextInactiveIncomplete: {
    color: theme.colors.inactiveGray,
  },

  buttonFocus: {
    '&:focus': {
      outline: theme.focusOutline,
    },
  },
}))

export default Step
