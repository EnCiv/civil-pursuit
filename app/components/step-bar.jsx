'use strict'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowPale from '../svgr/step-bar-arrow-pale'
import SvgStepBarSelectArrow from '../svgr/step-bar-select-arrow'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const stepRefs = steps.map(() => useRef(null))
  const stepContainerRef = useRef(null)
  const selectRef = useRef(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 50 * 16)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = event => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  const handleResize = () => {
    setIsMobile(window.innerWidth < 50 * 16)
  }

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
    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.addEventListener('click', handleClickOutside)
    }
  }, [stepRefs])

  const stepComponents = steps.map((step, index) => {
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
  })

  return !isMobile ? (
    <div className={classes.container} style={style}>
      <SvgStepBarArrowPale
        className={classes.svgStyling}
        width="25"
        height="4.9375rem"
        style={{ transform: 'rotate(180deg)', flexShrink: '0' }}
      />
      <div className={classes.stepsContainer} ref={stepContainerRef}>
        {stepComponents}
      </div>
      <SvgStepBarArrowPale style={{ flexShrink: '0' }} width="25" height="4.9375rem" />
    </div>
  ) : (
    <div className={classes.mobileContainer}>
      <div className={classes.mobileHeader}>Go to</div>

      <div className={classes.selectInput} onClick={handleOpen} ref={selectRef}>
        <div className={classes.selectItemsContainer}>
          <div className={classes.selectText}>Select a Step</div>
          <SvgStepBarSelectArrow width="20" height="20" />
        </div>
      </div>

      {isOpen && <div> this is the select menu</div>}

      {!isOpen && <div className={classes.breakStyle} />}
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
    // display: 'inline-block',
    // overflow: 'hidden',
    // minWidth: 'fit-content',
    // display: 'flex',
    // minWidth: 'fit-content',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
  },

  //mobile styles
  mobileContainer: {
    height: '23.0625rem',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileHeader: {
    fontFamily: 'Inter',
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '1.5rem',
    color: '#343433',
    paddingTop: '1.06rem',
    paddingLeft: '1.69rem',
  },
  selectInput: {
    margin: '0.44rem 1.56rem 0.94rem',
    display: 'flex',
    height: '2.5rem',
    borderRadius: '0.25rem',
    border: '0.125rem solid #EBEBEB',
    background: '#FFF',
  },
  selectItemsContainer: {
    display: 'inline-flex',
    width: '100%',
    padding: '0.3125rem 0.625rem 0.3125rem 0.9375rem',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: '#D9D9D9',
    fontFamily: 'Inter',
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '1.5rem',
  },
  breakStyle: {
    background: '#D9D9D9',
    height: '0.0625rem',
  },
}))

export default StepBar
