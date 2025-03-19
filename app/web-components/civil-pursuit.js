// https://github.com/EnCiv/civil-pursuit/issues/152

import React, { useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import QuestionBox from '../components/question-box'
import StepSlider from '../components/step-slider'
import SignUp from '../components/sign-up'
import MoreDetails from '../components/more-details'
import Tournament from '../components/tournament'

const WebComponents = {
  SignUp: SubWrap(SignUp),
  Details: SubWrap(MoreDetails),
  Tournament: Tournament,
  Conclusion: undefined, // TODO: Import the Conclusion component
  Feedback: undefined, // TODO: Import the Feedback component
}

function SubWrap(Component) {
  return props => {
    const classes = useStylesFromThemeFunction()
    return (
      <div className={classes.subWrapper}>
        <Component {...props} />
      </div>
    )
  }
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
    <div className={cx(classes.civilPursuit, className)} {...otherProps}>
      <QuestionBox className={classes.question} subject={subject} description={description} />
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
  subWrapper: {
    maxWidth: theme.condensedWidthBreakPoint,
    margin: 'auto',
    marginTop: '6rem',
  },
  civilPursuit: {
    width: '100%',
    maxWidth: theme.maxPanelWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  question: {
    paddingBottom: '6rem',
    marginBottom: '-3rem',
  },
}))

export default CivilPursuit
