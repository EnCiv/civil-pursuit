'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function Step(props) {
  const { name, title, complete, active, className, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const containerStyle = cx(
    {
      [classes.containerActive]: active && !complete,
      [classes.containerInactiveComplete]: (!active && complete) || (!active && !complete) || (!active && !complete),
    },
    className
  )
  const stepTextStyle = cx(
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
  containerActive: {
    padding: '0.625rem 0.9375rem',
    borderRadius: '0.625rem',
    background: 'rgba(6, 51, 92, 0.10)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },

  containerInactiveComplete: {
    padding: '0.625rem 0.9375rem',
    borderRadius: '0.625rem',
    background: '#FFF',
    '&:hover $stepTextActive': {
      ...theme.enCivUnderline,
    },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
  },

  stepTextActive: {
    color: '#06335C',
    textAlign: 'center',
    fontSize: '1.125rem',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '1.4375rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  stepTextInactiveIncomplete: {
    color: '#D9D9D9',
    textAlign: 'center',
    fontSize: '1.125rem',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '1.4375rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}))

export default Step
