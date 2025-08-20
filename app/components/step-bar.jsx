'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowDesktop from '../svgr/step-bar-arrow-desktop'
import SvgStepBarArrowMobile from '../svgr/step-bar-arrow-mobile'
import Theme from './theme'
import { set } from 'lodash'
import { optionIs } from '@jsonforms/core'

function isMobile() {
  return window.innerWidth < parseInt(Theme.condensedWidthBreakPoint) * 16 // 40rem is the mobile breakpoint
}

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const mobileBreakpoint = 40
  const stepbarDebounceTime = 100
  /* 
  The overflow: hidden property on the last step prevents us from finding the width of the last step, which
  messes up step width calculations. The dummy step below prevents this issue, by acting as the last step of width 0
  */
  const dummyStep = { name: '', title: '', complete: false, id: steps.length }

  /* 
  This component dynamically adjusts visible steps in the carousel based on container width. 
  handleCarouselSetup, optimized with debouncing, computes steps' widths and manages shifts on arrow clicks.
  Event listeners handle interactions and window resizing. 
  */

  /*
  I opted for this method due to its versatility across screen sizes and step bar dimensions. 
  Rendering only necessary steps outperforms CSS-heavy solutions, which may behave unpredictably across browsers or resolutions. 
  This approach also offers precise control over the last visible step, crucial for truncation if cut-off. 
  We debounce the function to prevent slowdowns caused from expensive page layout recalculations.
  */

  // Create an array of references. Each reference will be assigned to a step, allowing easy access to its visual width.
  const [stepRefs, setStepRefs] = useState(steps.map(() => useRef(null)))
  // Reference to the steps container, to collect the maximum width of step visibility.
  const stepContainerRef = useRef(null)
  // Reference to the select dropdown. to track click event targets that are not a descendant of the select input.
  const selectRef = useRef(null)
  // Reference to the select dropdown's options container. To track click event targets that are not in the options container.
  const optionsContainerRef = useRef(null)
  // State to determine whether to display the mobile or desktop view. Maintained by the window resize event listener.
  // State to handle the select input.
  const [isOpen, setIsOpen] = useState(false)
  // State to map each 'page' of the steps carousel to its steps.
  const [pages, setPages] = useState(new Map())
  // State to hold the steps that should be rendered on each page.
  const [visibleSteps, setVisibleSteps] = useState([...steps, dummyStep].map((step, i) => ({ ...step, id: i + 1 })))
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

  const handleClickOutside = event => {
    // this function is added to the mouseup event handler on initial render. Rerenders will rewrite the function with the latest values of state variables,
    // but only the first render of this was added to the event listener. so don't depend on state variables, but their setters won't change so use those
    if (!isMobile()) return
    // If the menu is closed then check for the existence of select input reference.
    // If it exists and contains the click event target, then open the menu.
    // In other words, the user has clicked the input to open the menu.
    setIsOpen(isOpen => {
      if (!isOpen) {
        if (selectRef?.current && selectRef?.current.contains(event?.target)) {
          if (event.type === 'keyup' && event.key === 'Tab') return false // don't open the menu on tab key
          return true
        }
        // If the menu is open, then check for the existence of all the references.
        // If non-existent, then return.
      } else {
        if (selectRef?.current && optionsContainerRef?.current) {
          if (optionsContainerRef?.current?.contains(event?.target)) return isOpen // let the active menu item close it, and the inactive one leaves it open
          else return false // if the click is outside the select input and options container, close the menu
        } else {
          return isOpen
        }
      }
    })
  }

  const handleResize = () => {
    //setIsMobile(window.innerWidth < mobileBreakpoint * 16)
    setVisibleSteps([...steps, dummyStep])
    setTimeout(() => handleCarouselSetup()) // do this after the visibleSteps are rendered
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
  const handleCarouselSetup = () => {
    if (isMobile()) return
    // before calling handleCarouselSetup render all the steps so that all the widths can be measured

    if (!stepContainerRef?.current) return
    let containerWidth = stepContainerRef?.current?.offsetWidth

    const newMap = new Map()
    let currentWidth = 0
    let firstStepIndex = 0
    let page = 1
    let newSteps = []
    let initialPage = 1

    for (let i = 0; i < stepRefs.length; i++) {
      if (!stepRefs[i]?.current) return

      let width = stepRefs[i]?.current?.offsetWidth
      currentWidth += width

      if (i === current - 1) {
        // if the step is the current step, then we set the initial page
        initialPage = page
        setCurrentPage(initialPage)
      }
      if (currentWidth > containerWidth) {
        // if the current width exceeds the container width, then we are currently on the last visible step.
        // we slice to the last visible step, which is truncated (...) if needed. we then begin the process
        // from this step, so that it is the first step displayed on the next page.
        newSteps = stepsWithIds.slice(firstStepIndex, i + 1)
        newMap.set(page, newSteps)
        page++
        currentWidth = 0
        firstStepIndex = i
        i = i - 1
      }
      if (i === stepRefs.length - 1) {
        // if we are on the last step, slice from the index of the first visible step
        newSteps = stepsWithIds.slice(firstStepIndex)
        newMap.set(page, newSteps)
      }
    }
    setPages(newMap)
    setVisibleSteps(newMap.get(initialPage))
  }

  useEffect(() => {
    const handleResizeDebounced = debounce(handleResize, stepbarDebounceTime)

    window.addEventListener('resize', handleResizeDebounced)
    window.addEventListener('mouseup', handleClickOutside)
    window.addEventListener('keyup', handleClickOutside) // to close the select input when the user presses escape

    return () => {
      window.removeEventListener('resize', handleResizeDebounced)
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  /*
   Any changes in fonts, padding, etc after the width calculations could present visual issues in the step bar. 
   UseLayoutEffect ensures that widths are calculated after the layout is rendered. 
  */
  useLayoutEffect(() => {
    if (!isMobile()) {
      setVisibleSteps([...steps, dummyStep])
      setTimeout(() => handleCarouselSetup()) // do this after the visibleSteps are rendered
    }
  }, [isMobile(), current])

  /*
  NOTE that index refers to the index of the step within its array, while step.id refers to the step #. I.e, Step 2 has an id of 2.
  */
  return !isMobile() ? (
    <div className={cx(classes.container, className)} style={style}>
      <button onClick={leftClick} className={cx(classes.resetButtonStyling, classes.svgContainer)} data-testid="leftclick" tabIndex={currentPage !== 1 ? 0 : -1}>
        <SvgStepBarArrowDesktop className={cx({ [classes.svgColor]: currentPage === 1 })} width="1rem" height="1.2rem" style={{ transform: 'rotate(180deg)' }} />
      </button>
      <div className={classes.stepsContainer} ref={stepContainerRef}>
        {visibleSteps.map((step, index) => {
          return (
            <div ref={stepRefs[index]} className={cx(classes.stepDiv, { [classes.lastStep]: index === visibleSteps.length - 1 })} key={index}>
              <Step
                name={step.name}
                title={step.title}
                complete={step.id < steps.length ? steps[step.id - 1].complete : false}
                active={current === step.id ? true : false}
                unlocked={steps[step.id - 2] ? steps[step.id - 2].complete : step?.seen}
                onDone={() => onDone({ valid: true, value: step.id })}
                index={index}
                {...otherProps}
              />
            </div>
          )
        })}
      </div>
      <button onClick={rightClick} className={cx(classes.resetButtonStyling, classes.svgContainer, classes.svgContainerRight)} data-testid="rightclick" tabIndex={currentPage !== pages.size ? 0 : -1}>
        <SvgStepBarArrowDesktop className={cx({ [classes.svgColor]: currentPage === pages.size })} width="1rem" height="1.2rem" />
      </button>
    </div>
  ) : (
    // MOBILE view
    <div className={classes.mobileContainer}>
      <div className={cx(classes.resetButtonStyling, classes.selectInput)} ref={selectRef} tabIndex={0} data-testid="mobile-select-bar">
        <div className={classes.selectItemsContainer}>
          <div className={classes.selectText}>{steps[current - 1].name}</div>
          {isOpen ? <SvgStepBarArrowMobile style={{ transform: 'rotate(180deg)', flexShrink: '0' }} width="13" height="13" /> : <SvgStepBarArrowMobile width="13" height="13" style={{ flexShrink: '0' }} />}
        </div>
      </div>
      {isOpen && (
        <div className={cx(classes.dropdownContainer, classes.customScrollbar)} ref={optionsContainerRef}>
          <div className={classes.dropdownContent}>
            <div className={classes.stepsContainerMobile}>
              {stepsWithIds.map((step, index) => {
                return (
                  <Step
                    key={index}
                    name={step.name}
                    title={step.title}
                    complete={steps[index].complete}
                    active={current === step.id ? true : false}
                    unlocked={index > 0 && steps[index - 1].complete}
                    onDone={() => {
                      setIsOpen(false) // close the dropdown when a step is selected
                      onDone({ valid: true, value: step.id })
                    }}
                    index={index}
                    {...otherProps}
                    ref={stepRefs[index]}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
      <div className={classes.breakStyle} />
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'flex',
    background: theme.transparent,
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

  resetButtonStyling: {
    border: 'none',
    background: 'transparent',

    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:active': {
      backgroundColor: 'transparent',
    },
    '&:focus': {
      outline: theme.focusOutline,
    },
  },

  //mobile styles
  mobileContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.white,
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
    position: 'absolute',
    left: '0',
    width: '100%',
    zIndex: '1000',
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
}))

export default StepBar
