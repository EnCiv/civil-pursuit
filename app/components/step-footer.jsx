import React from 'react'
import { createUseStyles } from 'react-jss'
import { TextButton, PrimaryButton } from './button.jsx'
import cx from 'classnames'

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.

function StepFooter(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = undefined, // a function that is called when the button is clicked.  - if it exists
    onBack = undefined,
    children,
    ...otherProps
  } = props

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.footerContainer}>
        <hr className={classes.line}></hr>
        <div className={classes.footerDiv}>
          {onBack && <TextButton onBack={onBack}>&lt; Back</TextButton>}
          {onDone && <PrimaryButton onDone={onDone}>Next</PrimaryButton>}
        </div>
      </div>
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
    padding: '1rem',
  },
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
    height: '0.5px',
  },
}))
export default StepFooter
