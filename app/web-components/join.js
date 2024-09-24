import React from 'react'
import { createUseStyles } from 'react-jss'
import SignUp from '../components/sign-up'

export default function Join(props) {
  const classes = useStylesFromThemeFunction()
  return (
    <div className={classes.join}>
      <SignUp className={classes.wrapper} startTab="Sign Up" {...props} />
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  join: {
    textAlign: 'center',
    paddingTop: '3rem',
    paddingBottom: '4rem',
    marginLeft: '2rem',
    marginRight: '2rem',
  },
  wrapper: {
    maxWidth: theme.condensedWidthBreakPoint,
    marginLeft: 'auto',
    marginRight: 'auto',
    whiteSpace: 'pre-line',
  },
}))
