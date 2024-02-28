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

  /* 
  This component dynamically adjusts visible steps in the carousel based on container width. 
  handleCarouselSetup, optimized with debouncing, computes steps' widths and manages shifts on arrow clicks.
  Event listeners handle interactions and window resizing. 
  */

  /*
  I opted for this method due to its versatility across screen sizes and step bar dimensions. 
  Rendering only necessary steps outperforms CSS control, which may behave unpredictably across browsers or resolutions. 
  This approach also offers precise control over the last visible step, crucial for truncation if cut-off. 
  We debounce the function to prevent slowdowns caused from expensive page layout recalculations.
  */

  const classes = useStylesFromThemeFunction()

  // Create an array of references. Each reference will be assigned to a step, allowing easy access to its visual width.
  const stepRefs = steps.map(() => useRef(null))
  // Refernce to the steps container, to collect the maximum width of step visibility.
  const stepContainerRef = useRef(null)
  // Reference to the select dropdown. Any click event target that is not a descendant of the select input will close the input.
  const selectRef = useRef(null)
  // State to determine whether to display the mobile or desktop view. Maintained by the window resize event listener.
  const [isMobile, setIsMobile] = useState(window.innerWidth < 50 * 16)
  // State to handle the select input.
  const [isOpen, setIsOpen] = useState(false)
  // State to map each 'page' of the steps carousel to its steps.
  const [pages, setPages] = useState(new Map())
  // State to hold the steps that should be rendered on each page. Not entirely necessary, but helps readability.
  const [visibleSteps, setVisibleSteps] = useState(steps)
  // State to manage the current page of the step bar.
  const [currentPage, setCurrentPage] = useState(1)
  // add a unique numerical identifier to each step
  const stepsWithIds = useMemo(() => {
    let newSteps = []
    for (let i = 0; i < steps.length; i++) {
      newSteps.push({ ...steps[i], id: i + 1 })
    }
    return newSteps
  }, [steps])

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = event => {
    // if the select input is currently rendered and it does not contain the click event target, then close the menu.
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  const handleResize = () => {
    setIsMobile(window.innerWidth < 50 * 16)
    handleCarouselSetup()
  }

  const rightClick = () => {
    if (currentPage < pages.size) {
      setVisibleSteps(pages.get(currentPage + 1))
      setCurrentPage(prev => prev + 1)
    }
  }

  const leftClick = () => {
    if (currentPage > 1) {
      setVisibleSteps(pages.get(currentPage - 1))
      setCurrentPage(prev => prev - 1)
    }
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

  /*
  To handle the setup of the carousel, the width of each step is calculated and compared to the total width of the container
  */
  const handleCarouselSetup = useCallback(
    debounce(() => {
      const newMap = new Map()
      let containerWidth = stepContainerRef?.current?.offsetWidth
      let currentWidth = 0
      let firstStepIndex = 0
      let page = 1
      let newSteps = []

      for (let i = 0; i < stepRefs.length; i++) {
        currentWidth += stepRefs[i]?.current?.offsetWidth

        if (i === stepRefs.length - 1) {
          // if we are on the last step, slice from the index of the first visible step
          newSteps = stepsWithIds.slice(firstStepIndex)
          newMap.set(page, newSteps)
        } else if (currentWidth > containerWidth) {
          // if the current width exceeds the container width, than we are currently on the last visible step
          newSteps = stepsWithIds.slice(firstStepIndex, i + 1)
          newMap.set(page, newSteps)
          page++
          currentWidth = 0
          firstStepIndex = i
        }
      }
      setPages(newMap)
      setVisibleSteps(newMap.get(1))
    }, 50),
    [setVisibleSteps, steps]
  )

  /*
   Any changes in fonts, padding, etc after the width calculations could present visual issues in the step bar. 
   UseLayoutEffect ensures that widths are calculated once the layout is rendered. 
  */
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

  /*
  NOTE that index refers to the index of the step within its array, while step.id refers to the step #. I.e, Step 2 has an id of 2.
  */
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
                active={current === step.id ? true : false}
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
              {stepsWithIds.map((step, index) => {
                return (
                  <Step
                    key={index}
                    name={step.name}
                    title={step.title}
                    complete={step.complete}
                    active={current === step.id ? true : false}
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
      stroke: theme.colors.svgArrow,
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
    ...theme.font,
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
    color: theme.colors.title,
    paddingTop: '1.06rem',
    paddingLeft: '1.69rem',
  },
  selectInput: {
    margin: '0.44rem 1.56rem 0rem',
    display: 'flex',
    borderRadius: '0.25rem',
    border: '0.125rem solid #EBEBEB',
    background: theme.colors.white,
  },
  selectItemsContainer: {
    display: 'inline-flex',
    width: '100%',
    padding: '0.3125rem 0.625rem 0.3125rem 0.9375rem',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: theme.colors.encivGray,
    ...theme.font,
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
  },
  breakStyle: {
    background: theme.colors.inactiveGray,
    height: '0.0625rem',
    marginTop: '0.94rem',
  },
  dropdownContainer: {
    display: 'flex',
    padding: '0.5rem',
    alignItems: 'flex-start',
    borderRadius: '0rem 0rem 0.25rem 0.25rem',
    border: '0.125rem solid #EBEBEB',
    background: theme.colors.white,
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
