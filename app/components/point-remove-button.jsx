'use strict'
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

const PointRemoveButton = (props) => {
  const { vState, className } = props
  const classes = useStylesFromThemeFunction()

  return (
    <div className={cx(classes.buttonDiv, className)}>
      <a className={classes.buttonClass}>Remove from Group</a>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  buttonDiv: {
    paddingTop: '0.5rem',
    width: '100%',
  },
  buttonClass: {
    display: 'flex',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.black,
    textDecorationLine: 'underline',
    cursor: 'pointer',
  }

}))

export default PointRemoveButton;