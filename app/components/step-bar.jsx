'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowDesktop from '../svgr/step-bar-arrow-desktop'
import SvgStepBarArrowMobile from '../svgr/step-bar-arrow-mobile'
import Theme from './theme'

function isMobile() {
  return window.innerWidth < parseInt(Theme.condensedWidthBreakPoint) * 16 // 40rem is the mobile breakpoint
}

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => {}, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const stepRefs = useRef([])
  const stepContainerRef = useRef(null)
  const selectRef = useRef(null)
  const optionsContainerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(isMobile)
  const stepsWithIds = useMemo(() => steps.map((step, i) => ({ ...step, id: i + 1 })), [steps])
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false })
  const isStepUnlocked = index => index === 0 || steps.slice(0, index).every(step => step.skip || step.complete)

  const getCenteredScrollLeft = step => {
    const container = stepContainerRef.current
    if (!container || !step) return 0
    const containerBounds = container.getBoundingClientRect()
    const stepBounds = step.getBoundingClientRect()
    const targetLeft = container.scrollLeft + stepBounds.left - containerBounds.left - (container.clientWidth - stepBounds.width) / 2
    return Math.max(0, Math.min(targetLeft, container.scrollWidth - container.clientWidth))
  }

  const updateScrollState = () => {
    const container = stepContainerRef.current
    if (!container) return
    const firstStep = stepRefs.current[0]
    const lastStep = stepRefs.current[steps.length - 1]
    const nextScrollState = {
      canScrollLeft: container.scrollLeft > getCenteredScrollLeft(firstStep) + 1,
      canScrollRight: container.scrollLeft < getCenteredScrollLeft(lastStep) - 1,
    }
    setScrollState(previous =>
      previous.canScrollLeft === nextScrollState.canScrollLeft && previous.canScrollRight === nextScrollState.canScrollRight
        ? previous
        : nextScrollState
    )
  }

  const centerCurrentStep = () => {
    if (isMobileLayout) return
    const container = stepContainerRef.current
    const currentStep = stepRefs.current[current - 1]
    if (!container || !currentStep) return

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    container.scrollTo({
      left: getCenteredScrollLeft(currentStep),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  const scrollSteps = direction => {
    const container = stepContainerRef.current
    if (!container) return
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    container.scrollBy({
      left: direction * container.clientWidth / 3,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  const leftClick = () => scrollSteps(-1)
  const rightClick = () => scrollSteps(1)

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

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    window.addEventListener('keyup', handleClickOutside) // to close the select input when the user presses escape

    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const updateMobileLayout = () => setIsMobileLayout(isMobile())
    window.addEventListener('resize', updateMobileLayout)
    return () => window.removeEventListener('resize', updateMobileLayout)
  }, [])

  useLayoutEffect(() => {
    centerCurrentStep()
    updateScrollState()
  }, [current, steps.length, isMobileLayout])

  useEffect(() => {
    const container = stepContainerRef.current
    if (!container || isMobileLayout || !window.ResizeObserver) return
    const resizeObserver = new window.ResizeObserver(() => {
      centerCurrentStep()
      updateScrollState()
    })
    resizeObserver.observe(container)
    stepRefs.current.forEach(step => step && resizeObserver.observe(step))
    return () => resizeObserver.disconnect()
  }, [current, steps.length, isMobileLayout])

  /*
  NOTE that index refers to the index of the step within its array, while step.id refers to the step #. I.e, Step 2 has an id of 2.
  */
  return !isMobileLayout ? (
    <div className={cx(classes.container, className)} style={style}>
      <button onClick={leftClick} className={cx(classes.resetButtonStyling, classes.svgContainer)} data-testid="leftclick" aria-label="Scroll steps left" disabled={!scrollState.canScrollLeft}>
        <SvgStepBarArrowDesktop className={cx({ [classes.svgColor]: !scrollState.canScrollLeft })} width="1rem" height="1.2rem" style={{ transform: 'rotate(180deg)' }} />
      </button>
      <div className={classes.stepsContainer} ref={stepContainerRef} onScroll={updateScrollState}>
        {stepsWithIds.map((step, index) => {
          const stepUnlocked = isStepUnlocked(index)
          return (
            <div ref={element => (stepRefs.current[index] = element)} className={classes.stepDiv} key={step.id}>
              <Step
                name={step.name}
                title={step.title}
                stepIndex={step.id}
                complete={steps[index].complete && stepUnlocked}
                active={current === step.id ? true : false}
                unlocked={stepUnlocked}
                skip={steps[index].skip}
                onDone={() => onDone({ valid: true, value: step.id })}
                index={index}
                {...otherProps}
              />
            </div>
          )
        })}
      </div>
      <button onClick={rightClick} className={cx(classes.resetButtonStyling, classes.svgContainer, classes.svgContainerRight)} data-testid="rightclick" aria-label="Scroll steps right" disabled={!scrollState.canScrollRight}>
        <SvgStepBarArrowDesktop className={cx({ [classes.svgColor]: !scrollState.canScrollRight })} width="1rem" height="1.2rem" />
      </button>
    </div>
  ) : (
    // MOBILE view
    <div className={classes.mobileContainer}>
      <div className={cx(classes.resetButtonStyling, classes.selectInput)} ref={selectRef} data-testid="mobile-select-bar" aria-expanded={isOpen}>
        <div className={classes.selectItemsContainer}>
          <Step
            className={classes.selectItemsContainerStep}
            style={{ paddingRight: '2.5rem' }}
            name={steps[current - 1].name}
            title={steps[current - 1].title}
            stepIndex={current}
            complete={steps[current - 1].complete}
            active
            unlocked
            skip={steps[current - 1].skip}
            onDone={() => setIsOpen(true)}
            index={current - 1}
            {...otherProps}
          />
          <span className={classes.selectCaret} aria-hidden="true">
            {isOpen ? <SvgStepBarArrowMobile style={{ transform: 'rotate(180deg)' }} width="13" height="13" /> : <SvgStepBarArrowMobile width="13" height="13" />}
          </span>
        </div>
        <div className={cx(classes.dropdownContainer, classes.customScrollbar, { [classes.dropdownOpen]: isOpen })} ref={optionsContainerRef} aria-hidden={!isOpen} data-testid="mobile-step-options">
            <div className={classes.dropdownContent}>
              <div className={classes.stepsContainerMobile}>
                {stepsWithIds.map((step, index) => {
                  const stepUnlocked = isStepUnlocked(index)
                  return (
                    <Step
                      key={index}
                      stepIndex={step.id}
                      name={step.name}
                      title={step.title}
                      complete={steps[index].complete && stepUnlocked}
                      active={current === step.id ? true : false}
                      unlocked={stepUnlocked}
                      skip={steps[index].skip}
                      onDone={() => {
                        setIsOpen(false) // close the dropdown when a step is selected
                        onDone({ valid: true, value: step.id })
                      }}
                      index={index}
                      {...otherProps}
                      ref={element => (stepRefs.current[index] = element)}
                    />
                  )
                })}
              </div>
            </div>
        </div>
      </div>
      <div className={classes.breakStyle} />
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'flex',
    background: theme.transparent,
    containerType: 'inline-size',
    containerName: 'stepBar',
  },

  stepsContainer: {
    display: 'flex',
    flex: '1 1 0%',
    minWidth: 0,
    height: '5rem',
    alignItems: 'center',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
    scrollbarWidth: 'none',
    boxSizing: 'border-box',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&::before, &::after': {
      content: '""',
      display: 'block',
      flex: '0 0 33.333333%',
    },
    '@container stepBar (min-width: 90rem)': {
      '&::before, &::after': {
        flex: '0 0 40%',
      },
    },
  },

  stepDiv: {
    display: 'flex',
    flex: '0 0 33.333333%',
    minWidth: 0,
    padding: '0 0.25rem',
    boxSizing: 'border-box',
    '@container stepBar (min-width: 90rem)': {
      flex: '0 0 20%',
    },
  },

  svgContainer: {
    display: 'flex',
    flexShrink: 0,
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
    '&:disabled': {
      cursor: 'default',
      opacity: 0.4,
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
    position: 'relative',
    borderRadius: '0.625rem',
    background: 'transparent',
  },
  selectItemsContainer: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    minWidth: 0,
    alignItems: 'center',
  },
  selectItemsContainerStep: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  selectCaret: {
    position: 'absolute',
    top: '50%',
    right: '0.9375rem',
    display: 'flex',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  breakStyle: {
    background: theme.colors.inactiveGray,
    height: '0.0625rem',
    marginTop: '0.94rem',
  },
  dropdownContainer: {
    boxSizing: 'border-box',
    width: '100%',
    maxHeight: 0,
    padding: '0 0.5rem',
    overflow: 'hidden',
    opacity: 0,
    transform: 'translateY(-0.4rem)',
    visibility: 'hidden',
    pointerEvents: 'none',
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    borderTop: '0',
    borderRadius: '0 0 0.625rem 0.625rem',
    background: theme.colors.white,
    position: 'absolute',
    left: '0',
    top: '100%',
    zIndex: '1000',
    boxShadow: '0 0.5rem 1rem rgba(26, 26, 26, 0.16)',
    transition: 'max-height 260ms ease, opacity 180ms ease, transform 260ms ease, padding 260ms ease, visibility 260ms',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  dropdownOpen: {
    maxHeight: '60vh',
    padding: '0.5rem',
    overflowY: 'auto',
    opacity: 1,
    transform: 'translateY(0)',
    visibility: 'visible',
    pointerEvents: 'auto',
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
