'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { PositioningPortal } from '@codastic/react-positioning-portal/lib'

function Step(props) {
  const { name, title, complete, active, onDone = () => {}, index, className, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  // how long the title will be displayed when longpress is triggered
  const displayTime = Math.max(8, 0.1 * title.length) * 1000
  // state to manage open status of the portal
  const [isPortalOpen, setIsPortalOpen] = useState(false)
  // reference to hold timeout variable throughout lifetime of the component
  const timeRef = useRef(null)

  const containerStyle = cx(
    classes.sharedContainerStyles,
    {
      [classes.containerActive]: active,
      [classes.containerInactiveComplete]: !active,
    },
    classes.resetButtonStyling,
    className
  )

  const textStyle = cx(classes.sharedTextStyles, {
    [classes.stepTextActive]: (active && !complete) || (!active && complete),
    [classes.stepTextInactiveIncomplete]: !active && !complete,
  })

  // begin a timneout when the span wrapping the step is clicked
  const handleMouseDown = () => {
    timeRef.current = setTimeout(() => {
      setIsPortalOpen(true)
    }, 500)
  }

  // clear the timeout when the click is finished
  const handleMouseUp = () => {
    clearTimeout(timeRef.current)
    setTimeout(() => setIsPortalOpen(false), displayTime)
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
    <span onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <PositioningPortal isOpen={isPortalOpen} portalContent={<span>{title}</span>}>
        <button
          className={containerStyle}
          onClick={() => {
            if (complete) onDone(index)
          }}
          title={`${title}`}
          data-testid="testClick"
          {...otherProps}
        >
          <div className={textStyle}>{name}</div>
        </button>
      </PositioningPortal>
    </span>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  sharedContainerStyles: {
    padding: '0.625rem 0.9375rem',
    borderRadius: '0.625rem',
    overflow: 'hidden',
    cursor: 'default',
  },

  containerActive: {
    background: theme.colors.stepContainerActive,
  },

  containerInactiveComplete: {
    background: theme.colors.white,
    '&:hover $stepTextActive': {
      ...theme.enCivUnderline,
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

  resetButtonStyling: {
    border: 'none',
    // background: 'transparent',

    '&:hover': {
      backgroundColor: 'inherit',
    },
    '&:active': {
      backgroundColor: 'transparent',
    },
  },
}))

export default Step
