'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/112

import React, { useState, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useCallback } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import shallowEqual from 'shallowequal'

import StepBar from './step-bar'
import StepFooter from './step-footer'

import PerfectScrollbar from 'react-perfect-scrollbar'
if (typeof window !== 'undefined') require('react-perfect-scrollbar/dist/css/styles.css')

const delayedSideEffect = setTimeout // basically put the side effect on the process queue and do it later

export const StepSlider = props => {
  const { children, onDone, steps, ...otherProps } = props
  const classes = useStyles(props)
  const navRef = useRef() // didn't work right with ref= so navRef
  const footerRef = useRef()
  const outerRef = useRef()
  const [navBarRect, setNavBarRect] = useState({ height: 0, width: 0, top: 0 })
  const [footerRect, setFooterRect] = useState({ height: 0, width: 0, bottom: 0 })
  const [outerRect, setOuterRect] = useState({ height: 0, width: 0 })
  const [transitions, setTransitions] = useState(false)
  const [_this] = useState({ timeout: 0, otherProps }) // _this object will exist through life of component so there is no setter it's like 'this'

  // resizeHandler needs to access outerRef and setOuterRec but never change so that the event can be removed
  // FTI resizeHandler gets called on initial render
  const resizeHandler = useCallback(() => {
    if (outerRef.current) {
      let rect = outerRef.current.getBoundingClientRect()
      if (rect.height && rect.width) {
        // there is an issue on smartphones when rotating from landscape to portrait where the screen ends up shows a split between two components
        // to work around this we are turning of transitions and then turning them back on after the viewport size stableizes
        if (_this.timeout) clearTimeout(_this.timeout)
        else setTransitions(false) // careful - the value of transitions will never be changed inside this memorized callback
        _this.timeout = setTimeout(() => {
          if (outerRef.current) {
            // just to make sure
            let rect = outerRef.current.getBoundingClientRect()
            if (rect.height && rect.width) setOuterRect(rect)
          }
          setTransitions(true)
          _this.timeout = 0
        }, 100)
        setOuterRect(rect)
      }
    }
  }, [])

  // if window resizes we need to recalculate or so the boxes are same size as new viewport
  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  // if the other props have changed, we need to rerender the children
  // _this.otherProps is only changed if it's shallow - different
  // _this is written directcly because we don't want to cause another rerender - we just want to save the value for next time
  if (!shallowEqual(_this.otherProps, otherProps)) _this.otherProps = otherProps

  // has to be useLaoutEffect not useEffect or transitions will get enabled before the first render of the children and it will be blurry
  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      if (navRef.current) {
        let navRect = navRef.current.getBoundingClientRect()
        if (navRect.height && navRect.width) setNavBarRect(navRect)
      }
      if (footerRef.current) {
        let footRect = footerRef.current.getBoundingClientRect()
        if (footRect.height && footRect.width) setFooterRect(footRect)
      }
    }, [navRef.current, footerRef.current])
  }
  if (typeof window !== 'undefined') useLayoutEffect(resizeHandler, [outerRef.current])

  function reducer(state, action) {
    const getIncrementedState = () => {
      // Set next navigated-to panel as seen so we can render it
      let currentStep = Math.min(state.currentStep + 1, children.length - 1)

      if (steps) {
        let newStatuses = {
          ...state.stepStatuses,
          [currentStep]: { ...state.stepStatuses[currentStep], seen: true },
        }
        state.stepStatuses = Object.keys(newStatuses).map(key => newStatuses[key])
      }

      return {
        ...state,
        currentStep: currentStep,
        sendDoneToParent: state.currentStep >= children.length - 1,
      }
    }

    switch (action.type) {
      case 'increment':
        return getIncrementedState()
      case 'decrement':
        return {
          ...state,
          currentStep: Math.max(0, state.currentStep - 1),
          sendDoneToParent: state.currentStep === children.length - 1,
        }
      case 'clearSendDoneToParent':
        return { ...state, sendDoneToParent: false }
      case 'updateStatuses':
        let { valid, index } = action.payload
        let newStatuses

        if (steps) {
          if (valid) {
            newStatuses = {
              ...state.stepStatuses,
              [index]: { ...state.stepStatuses[index], complete: true },
            }
          } else {
            // Disable navigation to all steps after if invalid
            newStatuses = state.stepStatuses.map((stepStatus, index) => {
              if (index >= state.currentStep) {
                return { ...stepStatus, complete: false }
              } else {
                return stepStatus
              }
            })
          }
          return { ...state, stepStatuses: Object.keys(newStatuses).map(key => newStatuses[key]) }
        } else {
          if (valid) return getIncrementedState()
        }
    }
  }
  // Keep track of each step's seen/completion status
  // Populate statuses with initial values
  if (steps) steps[0].seen = true
  const [state, dispatch] = useReducer(reducer, { currentStep: 0, sendDoneToParent: false, stepStatuses: steps })

  // the children need to be cloned to have the onDone function applied, but we don't want to redo this every time we re-render
  // so it's done in a memo
  const clonedChildren = useMemo(
    () =>
      // Only render if component has been seen
      children.map((child, index) =>
        React.cloneElement(child, {
          ...otherProps,
          ...child.props,
          key: [index],
          onDone: valid => {
            dispatch({ type: 'updateStatuses', payload: { valid: valid, index: index } })
          },
        })
      ),
    [children, _this.otherProps]
  )
  // don't enable transitions until after the children have been rendered or the initial render will be blurry
  // the delayedSideEffect is necessary to delay the transitions until after the initial render
  if (typeof window !== 'undefined')
    useLayoutEffect(() => {
      if (clonedChildren) delayedSideEffect(() => setTransitions(true))
    }, [clonedChildren])
  useEffect(() => {
    if (state.sendDoneToParent) {
      dispatch({ type: 'clearSendDoneToParent' })
      onDone(state.currentStep === children.length - 1)
    }
  }, [state.sendDoneToParent])
  return (
    <div className={classes.outerWrapper} ref={outerRef}>
      {steps && (
        <div ref={navRef} className={classes.wrapper}>
          {state.stepStatuses.length > 0 && (
            <StepBar
              steps={state.stepStatuses}
              current={state.currentStep + 1}
              className={classes.navBar}
              onDone={onDoneResult => {
                if (onDoneResult.value) {
                  // Skip to the clicked step, considering value is a count from 1 while currentStep is zero-indexed.
                  let repetitions = Math.abs(state.currentStep - (onDoneResult.value - 1))
                  for (let reps = 0; reps < repetitions; reps++) {
                    dispatch({ type: onDoneResult.value <= state.currentStep ? 'decrement' : 'increment' })
                  }
                }
              }}
            />
          )}
        </div>
      )}
      <div
        style={{
          left: -outerRect.width * state.currentStep + 'px',
          width: outerRect.width * children.length + 'px',
        }}
        className={cx(classes.wrapper, transitions && classes.transitions)}
      >
        {outerRect.width &&
          clonedChildren.map(child => (
            <div
              style={{
                width: outerRect.width + 'px',
                height:
                  window.innerHeight -
                  (footerRect.height ? footerRect.height : outerRect.top) -
                  (navBarRect.height ? navBarRect.height : outerRect.top),
              }}
              className={classes.panel}
            >
              {(!steps || (steps && state.stepStatuses[child.key].seen)) && child && (
                <PerfectScrollbar style={{ width: 'inherit', height: '100%' }}>{child}</PerfectScrollbar>
              )}
            </div>
          ))}
      </div>
      {steps && (
        <div ref={footerRef} className={classes.wrapper}>
          <StepFooter
            className={classes.stepFooter}
            onDone={() => {
              dispatch({ type: 'increment' })
            }}
            onBack={state.currentStep > 0 ? () => dispatch({ type: 'decrement' }) : null}
            active={state.stepStatuses[state.currentStep] && state.stepStatuses[state.currentStep]['complete']}
          />
        </div>
      )}
    </div>
  )
}
const useStyles = createUseStyles({
  panel: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  navBar: {
    width: 'inherit',
    zIndex: 1,
    backgroundColor: 'white',
  },
  stepFooter: {
    width: 'inherit',
    zIndex: 1,
    padding: 0,
    backgroundColor: 'white',
  },
  outerWrapper: {
    position: 'absolute', // so that clip will work
    width: 'inherit',
    overflow: 'hidden',
    height: '100%',
    clip: 'rect(0,auto,auto,0)', // to make sure the fixed position NavBar in a child is also hidden
    backgroundColor: 'inherit', // otherwise background is white
  },
  wrapper: {
    width: '100%',
    position: 'relative',
  },
  transitions: {
    transition: 'all 0.5s linear',
  },
})

export default StepSlider
