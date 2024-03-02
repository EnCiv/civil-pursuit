import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button, TextButton } from './button.jsx'
import cx from 'classnames'

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.

function StepFooter(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    onBack = () => {},
    disabled = false,
    disableOnClick = false, // if true, the button gets disabled after click and stays disabled - prevents resubmission
    children,
    ...otherProps
  } = props

  return onDone() === undefined || onBack() === undefined ? (
    <div></div>
  ) : (
    <div className={cx(classes.sharedBorderStyle, className)} {...otherProps}>
      <div className={classes.footerContainer}>
        <hr className={classes.line}></hr>
        <div className={classes.footerDiv}>
          <TextButton className={classes.back}>&lt; Back</TextButton>
          <Button className={classes.button}>Next</Button>
        </div>
      </div>
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
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
