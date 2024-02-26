import React from 'react'
import { createUseStyles } from 'react-jss'

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const useStyles = createUseStyles({
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
    borderRadius: '8px',
    padding: '8px 20px',
    width: '221px',
    height: '50px',
    '&:active': {
      backgroundColor: '#06335C',
      color: 'white',
    },
    '&:hover': { backgroundColor: '#06335C', color: 'white' },
  },
})
function StepFooter() {
  const classes = useStyles()

  return (
    <div>
      <hr className={classes.line}></hr>
      <div className={classes.footerDiv}>
        <a className={classes.back}>&lt; Back</a>
        <button className={classes.button}>Next</button>
      </div>
    </div>
  )
}

export default StepFooter
