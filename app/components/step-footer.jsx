//https://github.com/EnCiv/civil-pursuit/issues/51
import React from 'react'
import { createUseStyles } from 'react-jss'
import { TextButton, PrimaryButton } from './button.jsx'
import cx from 'classnames'

function StepFooter(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = undefined, // a function that is called when the button is clicked.  - if it exists
    onBack = undefined,
    children,
    active = true,
    ...otherProps
  } = props

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.footerContainer}>
        <hr className={classes.line}></hr>
        <div className={classes.footerDiv}>
          {onBack ? (
            <TextButton className={classes.back} onDone={onBack}>
              &lt; Back
            </TextButton>
          ) : (
            <div></div>
          )}
          {onDone && (
            <PrimaryButton className={classes.next} onDone={onDone} disabled={!active}>
              Next
            </PrimaryButton>
          )}
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
  footerContainer: {},
  footerDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    height: '0.5px',
    width: '100%',
  },
  back: {
    margin: '0.5rem 2rem',
  },
  next: {
    margin: '1rem 2rem',
  },
}))
export default StepFooter
