'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46
// https://github.com/EnCiv/civil-pursuit/issues/332

import React, { forwardRef, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { TooltipPortal } from './tooltip-portal'

const Step = forwardRef((props, ref) => {
  const { name = '', title = '', complete, active, unlocked, skip, onDone = () => {}, index, stepIndex, className, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  // how long the title will be displayed when longpress is triggered
  const displayTime = Math.max(8, 0.1 * title.length) * 1000
  const isStepEnabled = !skip && (complete || active || unlocked)
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
        [classes.containerDisabled]: !isStepEnabled,
    },
    className
  )

  const textStyle = cx(classes.sharedTextStyles, {
    [classes.stepTextActive]: isStepEnabled,
    [classes.stepTextInactiveIncomplete]: !isStepEnabled,
  })
  const stepNumberStyle = cx(classes.stepNumber, isStepEnabled ? classes.stepNumberEnabled : classes.stepNumberDisabled, active && classes.stepNumberCurrent)
  const displayName = name.replace(/^Step\s+\d+\s*:\s*/i, '')

  // begin a timneout when the span wrapping the step is clicked
  const handleMouseDown = () => {
    if (!title) return
    timeRef.current = setTimeout(() => {
      setIsPortalOpen(true)
    }, 500)
  }

  // clear the timeout when the click is finished
  const handleMouseUp = event => {
    clearTimeout(timeRef.current)
    setTimeout(() => setIsPortalOpen(false), displayTime)
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
    <button
      type="button"
      className={containerStyle}
      disabled={!isStepEnabled}
      aria-disabled={!isStepEnabled}
      onClick={e => {
        e.stopPropagation()
        if (!skip && (complete || active || unlocked)) onDone(index)
      }}
      title={`${title}`}
      tabIndex={isStepEnabled ? 0 : -1}
      aria-current={active ? 'step' : undefined}
      data-testid="testClick"
      ref={isStepEnabled ? ref : null}
      {...otherProps}
    >
      <span onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <TooltipPortal isOpen={isPortalOpen} portalContent={<span>{title}</span>}>
          <span className={textStyle}>
            <span className={cx(classes.stepName, active && classes.currentStepName)}>{displayName}</span>
            <span className={stepNumberStyle}>Step {stepIndex}</span>
          </span>
        </TooltipPortal>
      </span>
    </button>
  )
})

const useStylesFromThemeFunction = createUseStyles(theme => ({
  sharedContainerStyles: {
    width: '100%',
    minWidth: 0,
    padding: '0.625rem 0.9375rem',
    borderRadius: '0.625rem',
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    boxSizing: 'border-box',
    overflow: 'hidden',
    cursor: 'default',
    transition: `background-color ${theme.motion.short} ${theme.motion.standardEase}, border-color ${theme.motion.short} ${theme.motion.standardEase}, box-shadow ${theme.motion.short} ${theme.motion.standardEase}, transform ${theme.motion.short} ${theme.motion.standardEase}`,
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },

  containerActive: {
    background: theme.colors.lightGray,
    borderColor: theme.colors.primaryButtonBlue,
    boxShadow: '0 0 0 0.0625rem rgba(6, 51, 92, 0.1), 0 0.2rem 0.5rem rgba(26, 26, 26, 0.1)',
    '&:hover $stepTextActive': {
      ...theme.enCivUnderline,
      cursor: 'pointer',
    },
  },

  containerInactiveComplete: {
    background: theme.colors.white,
    '&:hover $stepTextActive': {
      ...theme.enCivUnderline,
      cursor: 'pointer',
    },
  },

  containerDisabled: {
    opacity: 0.7,
  },

  sharedTextStyles: {
    ...theme.font,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.125rem',
    textAlign: 'start',
  },

  stepName: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.25,
  },

  currentStepName: {
    fontWeight: 700,
  },

  stepNumber: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },

  stepNumberEnabled: {
    color: theme.colors.primaryButtonBlue,
  },

  stepNumberDisabled: {
    color: theme.colors.encivGray,
  },

  stepNumberCurrent: {
    fontWeight: 700,
  },

  stepTextActive: {
    color: theme.colors.primaryButtonBlue,
  },

  stepTextInactiveIncomplete: {
    color: theme.colors.encivGray,
  },

  buttonFocus: {
    '&:focus': {
      outline: theme.focusOutline,
    },
  },
}))

export default Step
