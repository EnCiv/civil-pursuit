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
    backgroundColor: '#FFF',
    color: '#403105',
    ...sharedLeadButtonStyles,
    '&:hover': {
      backgroundColor: '#FFF',
      color: '#403105',
      borderColor: '#FFC315',
    },
  },

  mouseDownButton: {
    backgroundColor: '#FFC315',
    color: '#1A1A1A',
    ...sharedLeadButtonStyles,
    '&:hover': {
      backgroundColor: '#FFC315',
      color: '#1A1A1A',
      borderColor: '#FFC315',
    },
  },

  buttonDiv: {
    paddingTop: '0.5rem',
    width: '100%',
  },

  hovered: {
    backgroundColor: '#FFF',
    color: '#403105',
    borderColor: '#FFC315',
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
  border: '2px solid #FFC315',

  fontFamily: 'Inter',
  fontSize: '1rem',
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '1.5rem',
  textAlign: 'center',
}

export default withTheme(PointLeadButton)
