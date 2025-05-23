// https://github.com/EnCiv/civil-pursuit/issues/152

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { Level } from 'react-accessible-headings'

import { DeliberationContextProvider } from '../components/deliberation-context'

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
  const { className, subject = '', description = '', steps = [], user, _id, browserConfig, env, location, path, participants = 0, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const [children, setChildren] = useState(buildChildren(steps)) // just do this once so we don't get rerenders

  return (
    <DeliberationContextProvider defaultValue={{ discussionId: _id, userId: user?.id, participants }}>
      <div className={cx(classes.civilPursuit, className)}>
        <QuestionBox className={classes.question} subject={subject} description={description} />
        <Level>
          <StepSlider
            children={children}
            onDone={valid => {
              // We're done!
            }}
            user={user}
            discussionId={_id}
          />
        </Level>
      </div>
    </DeliberationContextProvider>
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
    paddingTop: '3rem',
  },
  question: {
    paddingBottom: '6rem',
    marginBottom: '-3rem',
  },
}))

export default CivilPursuit
