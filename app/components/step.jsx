'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function Step(props) {
  const { name, title, complete, active, className, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const containerStyle = cx(
    classes.sharedContainerStyles,
    {
      [classes.containerActive]: active,
      [classes.containerInactiveComplete]: !active,
    },
    className
  )

  const textStyle = cx(
    classes.sharedTextStyles,
    {
      [classes.stepTextActive]: (active && !complete) || (!active && complete),
      [classes.stepTextInactiveIncomplete]: !active && !complete,
    },
    className
  )

  return (
    <div className={containerStyle} {...otherProps}>
      <div className={textStyle}>{name}</div>
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
  },

  stepTextActive: {
    color: theme.colors.darkBlue,
  },

  stepTextInactiveIncomplete: {
    color: theme.colors.lightGray,
  },
}))

export default Step
