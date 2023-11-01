'use strict'
import React from 'react'
import { createUseStyles, withTheme } from 'react-jss'
import cx from 'classnames'

function PointLeadButton(props) {
  const { vState, isHovered } = props
  const classes = useStylesFromThemeFunction()

  const buttonClass = cx(classes.sharedButtonStyle, classes[vState + 'Button'], {
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
    '&:hover': {
      backgroundColor: theme.colors.white,
      color: theme.colors.textBrown,
      borderColor: theme.colors.encivYellow,
    },
  },

  selectedButton: {
    backgroundColor: theme.colors.encivYellow,
    color: theme.colors.title,
    '&:hover': {
      backgroundColor: theme.colors.encivYellow,
      color: theme.colors.title,
      borderColor: theme.colors.encivYellow,
    },
  },

  buttonDiv: {
    paddingTop: '0.5rem',
    width: '100%',
  },

  hovered: {
    backgroundColor: theme.colors.white,
    color: theme.colors.textBrown,
    borderColor: theme.colors.encivYellow,
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.25rem',
  },

  sharedButtonStyle: {
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

    ...theme.font,
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: '1.5rem',
    textAlign: 'center',
  },
}))

export default withTheme(PointLeadButton)
