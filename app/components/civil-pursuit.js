// https://github.com/EnCiv/civil-pursuit/issues/152

import React, { useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import StepSlider from '../components/step-slider'
import SignUp from '../components/sign-up'
import MoreDetails from '../components/more-details'
import Tournament from '../components/tournament'

const WebComponents = {
  SignUp: SignUp,
  Details: MoreDetails,
  Tournament: Tournament,
  Conclusion: undefined, // TODO: Import the Conclusion component
  Feedback: undefined, // TODO: Import the Feedback component
}

function buildChildren(steps) {
  return steps.map(step => {
    const { webComponent, ...props } = step

    const LookupResult = WebComponents[webComponent]
    if (LookupResult) {
      // Pass all props from step obj except WebComponent
      return <LookupResult {...props} />
    } else {
      console.error(`Couldn't render step - component '${webComponent}' was not found in WebComponents.`)
      return <div>Couldn't render step - component '{webComponent}' was not found in WebComponents.</div>
    }
  })
}

function CivilPursuit(props) {
  const { className, subject = '', description = '', steps = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepSlider
        children={buildChildren(steps)}
        onDone={valid => {
          // We're done!
        }}
      />
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
  },
}))

export default CivilPursuit
