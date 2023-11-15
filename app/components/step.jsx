'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function Step(props) {
  const { name, title, complete, active, className, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const containerStyle = cx(
    classes.sharedContainerStyles,
    {
      [classes.containerActive]: active && !complete,
      [classes.containerInactiveComplete]: (!active && complete) || (!active && !complete) || (!active && !complete),
    },
    className
  )
  const stepTextStyle = cx(
    classes.sharedTextStyles,
    {
      [classes.stepTextActive]: (active && !complete) || (!active && complete),
      [classes.stepTextInactiveIncomplete]: !active && !complete,
    },
    className
  )

  return (
    <div className={containerStyle} {...otherProps}>
      <div className={stepTextStyle}>{name}</div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  sharedContainerStyles: {
    padding: '0.625rem 0.9375rem',
    borderRadius: '0.625rem',
  },

  containerActive: {
    background: 'rgba(6, 51, 92, 0.10)',
  },

  containerInactiveComplete: {
    background: '#FFF',
    '&:hover $stepTextActive': {
      ...theme.enCivUnderline,
    },
  },

  sharedTextStyles: {
    textAlign: 'center',
    fontSize: '1.125rem',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '1.4375rem',
    whiteSpace: 'nowrap',
  },

  stepTextActive: {
    color: '#06335C',
  },

  stepTextInactiveIncomplete: {
    color: '#D9D9D9',
  },
}))

export default Step
