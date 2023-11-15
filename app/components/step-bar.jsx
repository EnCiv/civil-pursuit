'use strict'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowPale from '../svgr/step-bar-arrow-pale'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const stepRefs = steps.map(() => useRef(null))
  const stepContainerRef = useRef(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 50 * 16)
  console.log(window.innerWidth)

  const handleResize = () => {
    setIsMobile(window.innerWidth < 50 * 16)
  }

  // console.log(steps, stepRefs)

  useEffect(() => {
    // let containerWidth = stepContainerRef.current.offsetWidth
    // let totalWidth = 0
    // for (let i = 0; i < stepRefs.length; i++) {
    //   totalWidth += stepRefs[i].current.offsetWidth
    //   if (totalWidth >= containerWidth) {
    //     // stepRefs[i].current.children[0].style.overflow = 'hidden'
    //     // stepRefs[i].current.children[0].style.textOverflow = 'ellipsis'
    //     // stepRefs[i].current.style.minWidth = 'auto'
    //     console.log(stepRefs[i].current)
    //     console.log(totalWidth, containerWidth, 'if case')
    //   } else {
    //     // stepRefs[i].current.style.minWidth = 'fit-content'
    //     console.log(stepRefs[i].current)
    //     console.log(totalWidth, containerWidth)
    //   }
    // }

    window.addEventListener('resize', handleResize)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [stepRefs])

  return !isMobile ? (
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
  ) : (
    <div>this is the mobile view</div>
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
    // display: 'inline-block',
    // overflow: 'hidden',
    // minWidth: 'fit-content',
    // display: 'flex',
    // minWidth: 'fit-content',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
  },
}))

export default StepBar
