// https://github.com/EnCiv/civil-pursuit/issues/152

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { Level } from 'react-accessible-headings'

import { DeliberationContextProvider } from '../components/deliberation-context'
import { DemInfoProvider, useDemInfoContext } from '../components/dem-info-context'

import QuestionBox from '../components/question-box'
import StepSlider from '../components/step-slider'
import SignUp from '../components/sign-up'
import Jsform from '../components/jsform'
import Tournament from '../components/tournament'
import Conclusion from '../components/steps/conclusion'

const WebComponents = {
  SignUp: SubWrap(SignUp),
  Jsform: SubWrap(Jsform),
  Tournament: Tournament,
  Conclusion: Conclusion,
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

function CivilPursuitContent({ subject, description, steps, user, _id, minParticipants, children }) {
  const classes = useStylesFromThemeFunction()
  // upsert uischema into DemInfoContext
  try {
    const { upsert } = useDemInfoContext()
    React.useEffect(() => {
      const stepsList = steps || []
      const moreDetailsStep = stepsList.find(s => s.webComponent === 'Jsform' && s.name === 'moreDetails')
      if (moreDetailsStep?.uischema) upsert({ uischema: moreDetailsStep.uischema })
    }, [steps, upsert])
  } catch (e) {
    // if context not available, skip
  }

  return (
    <div className={cx(classes.civilPursuit)}>
      <QuestionBox className={classes.question} subject={subject} description={description} discussionId={_id} minParticipants={minParticipants} />
      <Level>
        <StepSlider className={classes.stepPadding} children={children} user={user} discussionId={_id} />
      </Level>
    </div>
  )
}

function CivilPursuit(props) {
  const { className, subject = '', description = '', steps = [], user, _id, browserConfig, env, location, path, participants, minParticipants, ...otherProps } = props
  const [children] = useState(buildChildren(steps)) // just do this once so we don't get rerenders. steps don't change so there's no need for useMemo and dependencies

  return (
    <DeliberationContextProvider defaultValue={{ discussionId: _id, user, userId: user?.id, participants, subject, description, ...otherProps }}>
      <DemInfoProvider>
        <CivilPursuitContent subject={subject} description={description} steps={steps} user={user} _id={_id} minParticipants={minParticipants} children={children} />
      </DemInfoProvider>
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
  stepPadding: {
    marginLeft: '1rem',
    marginRight: '1rem',
  },
}))

export default CivilPursuit
