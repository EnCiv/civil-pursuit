import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button, TextButton } from './button.jsx'
// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.

function StepFooter() {
  const classes = useStyles()

  return (
    <div className={classes.footerContainer}>
      <hr className={classes.line}></hr>
      <div className={classes.footerDiv}>
        <TextButton className={classes.back}>&lt; Back</TextButton>
        <Button className={classes.button}>Next</Button>
      </div>
    </div>
  )
}
const useStyles = createUseStyles(theme => ({
  footerContainer: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '4rem',
    },
  },
  footerDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    backgroundColor: '#EBEBEB',
    height: '0.5px',
  },
  back: {
    color: '#5D5D5C',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#EBEBEB',
    borderStyle: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1.25rem',
    '&:active': {
      backgroundColor: '#06335C',
      color: 'white',
    },
    '&:hover': { backgroundColor: '#06335C', color: 'white' },
  },
}))
export default StepFooter
