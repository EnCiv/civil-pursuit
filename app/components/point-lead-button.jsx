'use strict'
import React from 'react'
import { createUseStyles, withTheme } from 'react-jss'
import cx from 'classnames'

function PointLeadButton(props) {
  const { vState, isHovered } = props
  const classes = useStylesFromThemeFunction()

  const buttonClass = cx(classes[vState + 'Button'], {
    [classes.hovered]: isHovered && vState === 'default',
  })

  return (
    <div className={classes['buttonDiv']}>
      <button className={buttonClass}>Select as Lead</button>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  defaultButton: {
    backgroundColor: theme.colors.white,
    color: theme.colors.textBrown,
    ...sharedLeadButtonStyles,
    '&:hover': {
      backgroundColor: theme.colors.white,
      color: theme.colors.textBrown,
      borderColor: theme.colors.warning,
    },
  },

  mouseDownButton: {
    backgroundColor: theme.colors.warning,
    color: theme.colors.textGray,
    ...sharedLeadButtonStyles,
    '&:hover': {
      backgroundColor: theme.colors.warning,
      color: theme.colors.textGray,
      borderColor: theme.colors.warning,
    },
  },

  buttonDiv: {
    paddingTop: '0.5rem',
    width: '100%',
  },

  hovered: {
    backgroundColor: theme.colors.white,
    color: theme.colors.textBrown,
    borderColor: theme.colors.warning,
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.25rem',
    ...sharedLeadButtonStyles,
  },
}))

const sharedLeadButtonStyles = {
  display: 'flex',
  width: '100%',
  height: 'auto',
  minHeight: '3.125rem',
  padding: '0.5rem 1.25rem',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '0.5rem',
  border: `0.125rem solid #FFC315`,

  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontSize: '1rem',
  fontWeight: '600',
  lineHeight: '1.5rem',
  textAlign: 'center',
}

export default withTheme(PointLeadButton)
