'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowPale from '../svgr/step-bar-arrow-pale'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  return (
    <div className={classes.container} style={style}>
      <SvgStepBarArrowPale
        className={classes.svgStyling}
        width="25"
        height="4.9375rem"
        style={{ transform: 'rotate(180deg)', flexShrink: '0' }}
      />
      <div className={classes.stepsContainer}>
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
      <SvgStepBarArrowPale style={{ flexShrink: '0' }} width="25" height="4.9375rem" />
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'inline-flex',
    background: '#FFF',
    alignItems: 'center',
    maxHeight: '4.9375rem',
  },

  stepsContainer: {
    display: 'flex',
    padding: '0rem 0.625rem',
    height: '3.5rem',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
}))

export default StepBar
