'use strict'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowPale from '../svgr/step-bar-arrow-pale'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const stepRefs = steps.map(() => useRef(null))
  const stepContainerRef = useRef(null)

  // console.log(steps, stepRefs)

  useEffect(() => {
    let containerWidth = stepContainerRef.current.offsetWidth
    let totalWidth = 0
    for (let i = 0; i < stepRefs.length; i++) {
      totalWidth += stepRefs[i].current.offsetWidth
      if (totalWidth >= containerWidth) {
        stepRefs[i].current.children[0].style.overflow = 'hidden'
        // stepRefs[i].current.children[0].style.textOverflow = 'ellipsis'
        stepRefs[i].current.style.minWidth = 'auto'
        console.log(stepRefs[i].current)
        console.log(totalWidth, containerWidth, 'if case')
      } else {
        // stepRefs[i].current.style.minWidth = 'fit-content'
        console.log(stepRefs[i].current)
        console.log(totalWidth, containerWidth)
      }
    }
  }, [stepRefs])

  return (
    <div className={classes.container} style={style}>
      <SvgStepBarArrowPale
        className={classes.svgStyling}
        width="25"
        height="4.9375rem"
        style={{ transform: 'rotate(180deg)', flexShrink: '0' }}
      />
      <div className={classes.stepsContainer} ref={stepContainerRef}>
        {steps.map((step, index) => {
          return (
            <div ref={stepRefs[index]} className={classes.stepDiv}>
              <Step
                ref={stepRefs[index]}
                key={index}
                name={step.name}
                title={step.title}
                complete={step.complete}
                active={current === index ? true : false}
                className={className}
                {...otherProps}
              />
            </div>
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
    display: 'inline-flex',
    padding: '0rem 0.625rem',
    height: '3.5rem',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },

  stepDiv: {
    overflow: 'hidden',
    display: 'flex',
    minWidth: 'fit-content',
  },
}))

export default StepBar
