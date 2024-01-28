'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowPale from '../svgr/step-bar-arrow-pale'
import SvgStepBarArrowFilled from '../svgr/step-bar-arrow-filled'
// import ReactScrollBar from './util/react-scrollbar'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const stepRefs = steps.map(() => useRef(null))
  const stepContainerRef = useRef(null)
  const selectRef = useRef(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 50 * 16)
  const [isOpen, setIsOpen] = useState(false)
  const [firstStepIndex, setFirstStepIndex] = useState(0)
  const [prevFirstStepIndex, setPrevFirstStepIndex] = useState(0)
  const [lastStepIndex, setLastStepIndex] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState(steps)

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
    handleCarouselSetup()
  }

  /**
   * Debounces a function to be called after a specified delay
   * @param {Function} func - The function to debounce.
   * @param {number} delay - The delay (in milliseconds) after which the function should be called.
   * @returns {Function} - The debounced function.
   */
  function debounce(func, delay) {
    let timeoutId

    return function (...args) {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  /* The carousel functionality implemented in this React component dynamically adjusts the number of
   visible steps based on the container's width. The handleCarouselSetup function, debounced for optimization, 
   calculates visible steps by accumulating their widths within the container. Arrow clicks shift the visible step 
   range accordingly. The carousel is responsive to window resizing, and event listeners manage interactions. */
  /*
    why am i doing this? because we need to only render a certain amount of steps within the bar. rendering ALL the steps
    will most likely cause headaches in the future when we need to truncate (...) the last visible step. We are debouncing it so that it doesn't
    cause the page to slow down. 

    TO DO: refactor the above paragrpahs, add an explanation to the debounced function
    REFACTOR the css
    TO DO: the navigation is a bit slow in the carousel
    TO DO: going right, left and then right results in going to the third page when you go right
    TO DO: when you get to the last page, the outer div shrinks to the size of the rendered steps
  
   */

  const handleCarouselSetup = useCallback(
    debounce(() => {
      let containerWidth = stepContainerRef?.current?.offsetWidth
      let currentWidth = 0
      for (let i = firstStepIndex; i < stepRefs.length; i++) {
        currentWidth += stepRefs[i]?.current?.offsetWidth
        // console.log(currentWidth, steps.slice(firstStepIndex), steps.slice(firstStepIndex, i + 1))

        if (i === stepRefs.length - 1) {
          let newSteps = steps.slice(firstStepIndex)
          setVisibleSteps(newSteps)
          setLastStepIndex(i)
          break
        }

        if (currentWidth > containerWidth) {
          let newSteps = steps.slice(firstStepIndex, i + 1)
          setVisibleSteps(newSteps)
          setLastStepIndex(i)
          console.log(newSteps)
          break
        }
        console.log(visibleSteps)
      }
      // console.log(visibleSteps, containerWidth, currentWidth)
    }, 300), // Adjust the debounce delay as needed
    [firstStepIndex, setPrevFirstStepIndex, setFirstStepIndex, setLastStepIndex, setVisibleSteps, steps]
  )

  const rightClick = () => {
    console.log('right click')
    setPrevFirstStepIndex(firstStepIndex)
    setFirstStepIndex(lastStepIndex)
  }

  const leftClick = () => {
    console.log('left click')
    setFirstStepIndex(prevFirstStepIndex)
  }

  useLayoutEffect(() => {
    if (!isMobile) {
      handleCarouselSetup()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, firstStepIndex])

  return !isMobile ? (
    <div className={classes.container} style={style}>
      <div onClick={leftClick}>
        <SvgStepBarArrowPale
          className={classes.svgStyling}
          width="1rem"
          height="1.5rem"
          style={{ transform: 'rotate(180deg)', flexShrink: '0' }}
        />
      </div>
      <div className={classes.stepsContainer} ref={stepContainerRef}>
        {visibleSteps.map((step, index) => {
          return (
            <div ref={stepRefs[index]} className={classes.stepDiv} key={index}>
              <Step
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
      <div onClick={rightClick}>
        <SvgStepBarArrowPale className={classes.svgStyling} width="1rem" height="1.5rem" />
      </div>
    </div>
  ) : (
    <div className={classes.mobileContainer}>
      <div className={classes.mobileHeader}>Go to</div>

      <div className={classes.selectInput} onClick={handleOpen} ref={selectRef}>
        <div className={classes.selectItemsContainer}>
          <div className={classes.selectText}>Select a Step</div>
          {isOpen ? (
            <SvgStepBarArrowFilled style={{ transform: 'rotate(180deg)', flexShrink: '0' }} width="13" height="13" />
          ) : (
            <SvgStepBarArrowFilled width="13" height="13" />
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
    margin: '0rem 1rem',
    height: '3.5rem',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
  },

  stepDiv: {
    display: 'inline-block',
    overflow: 'hidden',
    minWidth: 'fit-content',
    display: 'flex',
    minWidth: 'fit-content',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
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
  svgStyling: {
    paddingRight: '1rem',
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
