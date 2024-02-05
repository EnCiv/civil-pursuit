'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowDesktop from '../svgr/step-bar-arrow-desktop'
import SvgStepBarArrowMobile from '../svgr/step-bar-arrow-mobile'
// import ReactScrollBar from './util/react-scrollbar'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const stepRefs = steps.map(() => useRef(null))
  const stepContainerRef = useRef(null)
  const selectRef = useRef(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 50 * 16)
  const [isOpen, setIsOpen] = useState(false)

  const [pages, setPages] = useState(new Map())
  const [visibleSteps, setVisibleSteps] = useState(steps)
  const [currentPage, setCurrentPage] = useState(1)

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
  TO DO: refactor the explanation below, and add documentation to the debounce function and carousel setup, and the carousel (pages, visible steps, etc...). ADd debounce function to common

    I chose this approach because it is very generic and will work with any screen size/step bar size. rendering only the necessary steps seemed like
    the best option over attempting to control the visible steps through css, which may yield unpredictable results when used with different browsers or screen resolutions. 
    This also allows us to isolate (and therefore have full control over) the last visible step, which needs to be truncated in the event that it is cut-off. 
    This was a workaround, as attempting to achieve this behavior through pure css proved to be a headache (ie, adding text overflow property to every step would cause them all to truncate to the length of the cut-off step.)
    We are debouncing it so that it doesn't cause the page to slow down. 
   */

  const handleCarouselSetup = useCallback(
    debounce(() => {
      const newMap = new Map(pages)
      newMap.clear()
      let containerWidth = stepContainerRef?.current?.offsetWidth
      let currentWidth = 0
      let firstStepIndex = 0
      let page = 1
      let newSteps = []

      for (let i = 0; i < stepRefs.length; i++) {
        currentWidth += stepRefs[i]?.current?.offsetWidth

        if (i === stepRefs.length - 1) {
          newSteps = steps.slice(firstStepIndex)
          newMap.set(page, newSteps)
        } else if (currentWidth > containerWidth) {
          newSteps = steps.slice(firstStepIndex, i + 1)
          newMap.set(page, newSteps)
          page++
          currentWidth = 0
          firstStepIndex = i
          console.log('here')
          console.log(newSteps, newMap)
        }
      }
      setPages(newMap)
      setVisibleSteps(newMap.get(1))
      console.log(currentPage)
    }, 300),
    [setVisibleSteps, steps]
  )

  const rightClick = () => {
    if (currentPage < pages.size) {
      console.log('right click')
      setVisibleSteps(pages.get(currentPage + 1))
      setCurrentPage(prev => prev + 1)
      console.log(visibleSteps, pages, currentPage)
    }
  }

  const leftClick = () => {
    if (currentPage > 1) {
      console.log('left click')
      setVisibleSteps(pages.get(currentPage - 1))
      setCurrentPage(prev => prev - 1)
    }
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
  }, [isMobile])

  return !isMobile ? (
    <div className={cx(classes.container, className)} style={style}>
      <div onClick={leftClick} className={classes.svgContainer}>
        <SvgStepBarArrowDesktop
          className={cx({ [classes.svgColor]: currentPage === 1 })}
          width="1rem"
          height="1.2rem"
          style={{ transform: 'rotate(180deg)' }}
        />
      </div>
      <div className={classes.stepsContainer} ref={stepContainerRef}>
        {visibleSteps.map((step, index) => {
          return (
            <div
              ref={stepRefs[index]}
              className={cx(classes.stepDiv, { [classes.lastStep]: index === visibleSteps.length - 1 })}
              key={index}
            >
              <Step
                name={step.name}
                title={step.title}
                complete={step.complete}
                active={current === index ? true : false}
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
      <div onClick={rightClick} className={cx(classes.svgContainer, classes.svgContainerRight)}>
        <SvgStepBarArrowDesktop
          className={cx({ [classes.svgColor]: currentPage === pages.size })}
          width="1rem"
          height="1.2rem"
        />
      </div>
    </div>
  ) : (
    <div className={classes.mobileContainer}>
      <div className={classes.mobileHeader}>Go to</div>

      <div className={classes.selectInput} onClick={handleOpen} ref={selectRef}>
        <div className={classes.selectItemsContainer}>
          <div className={classes.selectText}>Select a Step</div>
          {isOpen ? (
            <SvgStepBarArrowMobile style={{ transform: 'rotate(180deg)', flexShrink: '0' }} width="13" height="13" />
          ) : (
            <SvgStepBarArrowMobile width="13" height="13" />
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
    display: 'flex',
    background: '#FFF',
  },

  stepsContainer: {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },

  stepDiv: {
    display: 'flex',
    boxSizing: 'border-box',
  },

  svgContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
  },

  svgContainerRight: {
    marginLeft: 'auto',
  },

  svgColor: {
    '& path': {
      stroke: 'rgb(206, 206, 206)',
    },
  },

  lastStep: {
    overflow: 'hidden',
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
