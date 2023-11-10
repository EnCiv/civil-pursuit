'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgArrowLeftPale from '../svgr/arrow-left-pale'
import SvgArrowRightPale from '../svgr/arrow-right-pale'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  return (
    <div className={classes.container} style={style}>
      <SvgArrowLeftPale width="25" height="84" />
      <div className={classes.stepsContainer}>
        <div className={classes.stepsDisplayed}>
          {steps.map((step, index) => {
            return (
              <Step
                key={index}
                name={step.name}
                title={step.title}
                complete={step.complete}
                active={current === index ? true : false}
                className={className}
                {...otherProps}
              />
            )
          })}
        </div>
      </div>
      <SvgArrowRightPale width="25" height="84" />
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'inline-flex',
    background: '#FFF',
    alignItems: 'center',
  },

  stepsContainer: {
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '0.625rem',
    overflow: 'hidden',
  },

  stepsDisplayed: {
    display: 'flex',
    padding: '0rem 0.625rem',
    height: '3.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

export default StepBar
