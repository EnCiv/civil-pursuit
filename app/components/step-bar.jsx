'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'

function StepBar(props) {
  const { className, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  return (
    <div className={classes.container}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="84" viewBox="0 0 25 84" fill="none">
        <g opacity="0.3">
          <path
            d="M17.2911 49.7317L8.36257 42.285L17.2911 34.8383"
            stroke="#5D5D5C"
            stroke-width="3"
            stroke-linecap="square"
            stroke-linejoin="round"
          />
        </g>
      </svg>
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
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'inline-flex',
    background: '#FFF',
    alignItems: 'center',
    overflow: 'hidden',
  },

  stepsContainer: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.625rem',
  },

  stepsDisplayed: {
    display: 'flex',
    padding: '0rem 0.625rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

export default StepBar
