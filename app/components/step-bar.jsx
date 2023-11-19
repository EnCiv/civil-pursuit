'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowPale from '../svgr/step-bar-arrow-pale'
import SvgStepBarSelectArrowOpen from '../svgr/step-bar-select-arrow-open'
import SvgStepBarSelectArrowClosed from '../svgr/step-bar-select-arrow-closed'
// import ReactScrollBar from './util/react-scrollbar'

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

  useLayoutEffect(() => {
    if (stepContainerRef.current) {
      let containerWidth = stepContainerRef.current.offsetWidth
      let totalWidth = 0
      for (let i = 0; i < stepRefs.length; i++) {
        totalWidth += stepRefs[i].current.offsetWidth
        if (totalWidth >= containerWidth) {
          // stepRefs[i].current.children[0].style.overflow = 'hidden'
          // stepRefs[i].current.children[0].style.textOverflow = 'ellipsis'
          // stepRefs[i].current.style.minWidth = 'auto'
          console.log(stepRefs[i].current)
          console.log(totalWidth, containerWidth, 'if case')
          break
        } else {
          // stepRefs[i].current.style.minWidth = 'fit-content'
          console.log(stepRefs[i].current)
          console.log(totalWidth, containerWidth)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.addEventListener('mousedown', handleClickOutside)
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
                onMouseDown={() => {
                  if (step.complete) {
                    onDone(index)
                  }
                }}
              />
            </div>
          )
        })}
      </div>
      <SvgStepBarArrowPale style={{ flexShrink: '0' }} width="25" height="4.9375rem" />
    </div>
  ) : (
    <div className={classes.mobileContainer}>
      <div className={classes.mobileHeader}>Go to</div>

      <div className={classes.selectInput} onClick={handleOpen} ref={selectRef}>
        <div className={classes.selectItemsContainer}>
          <div className={classes.selectText}>Select a Step</div>
          {isOpen ? (
            <SvgStepBarSelectArrowOpen width="20" height="20" />
          ) : (
            <SvgStepBarSelectArrowClosed width="20" height="20" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className={cx(classes.dropdownContainer, classes.customScrollbar)}>
          <div className={classes.dropdownContent}>
            <div className={classes.stepsContainerMobile}>
              {steps.map((step, index) => {
                return (
                  <Step
                    ref={stepRefs[index]}
                    key={index}
                    name={step.name}
                    title={step.title}
                    complete={step.complete}
                    active={current === index ? true : false}
                    className={className}
                    {...otherProps}
                    onMouseDown={() => {
                      if (step.complete) {
                        onDone(index)
                      }
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

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
    margin: '0.44rem 1.56rem 0rem',
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
    marginTop: '0.94rem',
  },
  dropdownContainer: {
    display: 'flex',
    padding: '0.5rem',
    alignItems: 'flex-start',
    borderRadius: '0rem 0rem 0.25rem 0.25rem',
    border: '0.125rem solid #EBEBEB',
    background: '#FFF',
    margin: '0rem 1.56rem',
    overflowY: 'scroll',
  },
  dropdownContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.3125rem',
    flexShrink: '0',
    width: '100%',
  },
  stepsContainerMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3125rem',
    flexShrink: '0',
    width: '100%',
  },

  //scrollbar
  // customScrollbar: {
  //   /* Track */
  //   '&::-webkit-scrollbar': {
  //     width: '12px',
  //     backgroundColor: '#fff', // White background for the scrollbar
  //     padding: '0.5rem', // Added padding
  //   },
  //   /* Handle */
  //   '&::-webkit-scrollbar-thumb': {
  //     width: '0.375rem',
  //     height: '5.6875rem',
  //     borderRadius: '2.5rem',
  //     background: '#D5D5DE',
  //   },
  //   /* Handle on hover */
  //   '&::-webkit-scrollbar-thumb:hover': {
  //     backgroundColor: '#45a049',
  //   },
  //   /* Track */
  //   '&::-webkit-scrollbar-track': {
  //     backgroundColor: '#f1f1f1',
  //   },
  //   /* For Firefox */
  //   scrollbarColor: '#D5D5DE #f1f1f1', // White background for the scrollbar
  //   scrollbarWidth: 'thin',
  //   /* For Edge and IE */
  //   '&::-ms-scrollbar-thumb': {
  //     width: '0.375rem',
  //     height: '5.6875rem',
  //     borderRadius: '2.5rem',
  //     backgroundColor: '#D5D5DE',
  //   },
  //   '&::-ms-scrollbar-track': {
  //     backgroundColor: '#f1f1f1',
  //   },
  // },
}))

export default StepBar
