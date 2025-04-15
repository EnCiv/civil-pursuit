'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/112

import React, { useState, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useCallback } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import shallowEqual from 'shallowequal'

import StepBar from './step-bar'
import StepFooter from './step-footer'

import PerfectScrollbar from 'react-perfect-scrollbar'
// added this line to build.js to make this work
// jss convert node_modules/react-perfect-scrollbar/dist/css/styles.css -f js -e cjs > node_modules/react-perfect-scrollbar/dist/css/styles.js
// don't forget to call useScrollBarCss() in the react component below to get the styles pulled in
import scrollBarCss from 'react-perfect-scrollbar/dist/css/styles'
const useScrollBarCss = createUseStyles(scrollBarCss)

const delayedSideEffect = setTimeout // basically put the side effect on the process queue and do it later
const allResizeHandlers = []
const callAllResizeHandlers = () => {
  allResizeHandlers.forEach(handler => setTimeout(handler))
}

export const StepSlider = props => {
  const [resizeHandlerIndex] = useState(allResizeHandlers.length)
  const { children, onDone, steps, className, stepName, stepintro, ...otherProps } = props // stepName and stepIntro are not used but are passed to children
  const classes = useStyles(props)
  useScrollBarCss(props) // so the styles are pulled in
  const navRef = useRef() // didn't work right with ref= so navRef
  const footerRef = useRef()
  const outerRef = useRef()
  const [navBarRect, setNavBarRect] = useState({ height: 0, width: 0, top: 0 })
  const [footerRect, setFooterRect] = useState({ height: 0, width: 0, bottom: 0 })
  const [outerRect, setOuterRect] = useState({ height: 0, width: 0 })
  const [_this] = useState({ timeout: 0, otherProps }) // _this object will exist through life of component so there is no setter it's like 'this'
  // resizeHandler needs to access outerRef and setOuterRec but never change so that the event can be removed
  // FTI resizeHandler gets called on initial render
  const resizeHandler = useCallback(() => {
    if (outerRef.current) {
      let rect = outerRef.current.getBoundingClientRect()
      rect.innerHeight = window.innerHeight
      if (rect.height && rect.width) {
        // there is an issue on smartphones when rotating from landscape to portrait where the screen ends up shows a split between two components
        // to work around this we are turning off transitions and then turning them back on after the viewport size stableizes
        if (_this.timeout) clearTimeout(_this.timeout)
        else dispatch({ type: 'transitionsOff' }) // careful - the value of transitions will never be changed inside this memorized callback
        _this.timeout = setTimeout(() => {
          if (outerRef.current) {
            // just to make sure
            let rect = outerRef.current.getBoundingClientRect()
            rect.innerHeight = window.innerHeight
            if (rect.height && rect.width) setOuterRect(rect)
          }
          dispatch({ type: 'transitionsOn' })
          _this.timeout = 0
        }, 100)
        setOuterRect(rect)
      }
    }
  }, [])
  allResizeHandlers[resizeHandlerIndex] = resizeHandler

  // if window resizes we need to recalculate or so the boxes are same size as new viewport
  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    window.addEventListener('scroll', callAllResizeHandlers)
    return () => {
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('scroll', callAllResizeHandlers)
    }
  }, [])

  // if the other props have changed, we need to rerender the children
  // _this.otherProps is only changed if it's shallow - different
  // _this is written directly because we don't want to cause another rerender - we just want to save the value for next time
  if (!shallowEqual(_this.otherProps, otherProps)) _this.otherProps = otherProps

  // has to be useLayoutEffect not useEffect or transitions will get enabled before the first render of the children and it will be blurry

  const stepNameToIndex = children.reduce((stepNameToIndex, child, index) => {
    const stepName = child.props.stepName || `step${index}`
    stepNameToIndex[stepName] = index
    return stepNameToIndex
  }, {})

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
  const [cachedChildren] = useState([])
  function reducer(state, action) {
    switch (action.type) {
      case 'transitionsOff':
        return { ...state, transitions: false }
      case 'transitionsOn':
        return { ...state, transitions: true }
      case 'moveTo': {
        const currentStep = action.to
        const stepStatuses = state.stepStatuses.map((stepStatus, i) => (i === currentStep ? { ...stepStatus, seen: true } : stepStatus))
        return {
          ...state,
          stepStatuses,
          currentStep,
          sendDoneToParent: state.currentStep >= children.length - 1,
        }
      }
      case 'increment':
        const nextStep = Math.min(state.currentStep + 1, children.length - 1)
        if (!cachedChildren[nextStep]) {
          return {
            ...state,
            transitions: false, // turn off transitions so the next step can render before the transition
            nextStep,
          }
        }
      // else flow through to finishIncrement
      case 'finishIncrement':
        const currentStep = Math.min(state.currentStep + 1, children.length - 1)
        const stepStatuses = state.stepStatuses?.map((stepStatus, i) => (i === currentStep ? { ...stepStatus, seen: true } : stepStatus))
        return {
          ...state,
          transitions: true,
          stepStatuses,
          currentStep,
          sendDoneToParent: state.currentStep >= children.length - 1,
        }
      case 'decrement':
        return {
          ...state,
          currentStep: Math.max(0, state.currentStep - 1),
          sendDoneToParent: state.currentStep === children.length - 1,
        }
      case 'clearSendDoneToParent':
        return { ...state, sendDoneToParent: false }
      case 'updateStatuses':
        let { result, index } = action.payload
        if (steps) {
          const stepStatuses = state.stepStatuses.map((stepStatus, i) => {
            if (result.valid || result.valid === undefined) {
              return i === index ? { ...stepStatus, complete: true } : stepStatus
            }
            // Disable navigation to all steps after if invalid
            else return i >= state.currentStep ? { ...stepStatus, complete: false } : stepStatus
          })
          return { ...state, stepStatuses: stepStatuses }
        } else if (result) {
          // Just increment if no steps
          const nextStep = Math.min(state.currentStep + 1, children.length - 1)
          return {
            ...state,
            transitions: false,
            nextStep,
            sendDoneToParent: state.currentStep >= children.length - 1,
          }
        } else {
          return state
        }
    }
  }
  // Keep track of each step's seen/completion status
  // Populate statuses with initial values
  if (steps) {
    steps[0].seen = true
    steps.forEach((step, index) => {
      steps[index].complete = false
    })
  }
  const [state, dispatch] = useReducer(reducer, { currentStep: 0, nextStep: 0, sendDoneToParent: false, stepStatuses: steps })

  function cloneChild(currentStep) {
    return React.cloneElement(children[currentStep], {
      ...otherProps,
      ...children[currentStep].props,
      key: currentStep,
      onDone: ({ valid, value }) => {
        if (valid && typeof stepNameToIndex[value] === 'number') dispatch({ type: 'moveTo', to: stepNameToIndex[value] })
        else dispatch({ type: 'updateStatuses', payload: { result: valid, index: currentStep } })
      },
    })
  }

  // in the initial case, nextStep and currentStep will be 0 and the first child will be rendered
  if (!cachedChildren[state.nextStep]) cachedChildren[state.nextStep] = cloneChild(state.nextStep)
  if (typeof window !== 'undefined')
    useLayoutEffect(() => {
      if (state.nextStep > state.currentStep) dispatch({ type: 'finishIncrement' })
    }, [state.nextStep])

  // don't enable transitions until after the children have been rendered or the initial render will be blurry
  // the delayedSideEffect is necessary to delay the transitions until after the initial render
  if (typeof window !== 'undefined')
    useLayoutEffect(() => {
      if (cachedChildren) delayedSideEffect(() => dispatch({ type: 'transitionsOn' }), 0)
    }, [cachedChildren])
  useEffect(() => {
    if (state.sendDoneToParent) {
      setTimeout(() => dispatch({ type: 'clearSendDoneToParent' }), 10000)
      onDone({ valid: state.currentStep === children.length - 1 })
    }
  }, [state.sendDoneToParent])
  return (
    <div className={className} style={{ height: outerRect.height + navBarRect.height + footerRect.height, width: '100%' }}>
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
            width: outerRect.width * cachedChildren.length + 'px',
          }}
          className={cx(classes.stepChildWrapper, state.transitions && classes.transitions)}
        >
          {outerRect.width &&
            cachedChildren.map(child => (
              <div
                style={{
                  width: outerRect.width + 'px',
                  height: Math.max(outerRect.top + outerRect.height, outerRect.innerHeight) - Math.max(0, outerRect.top) - footerRect.height - navBarRect.height + 'px',
                }}
                className={classes.panel}
              >
                {(!steps || (steps && state.stepStatuses[child.key].seen)) && child && <PerfectScrollbar onScrollY={callAllResizeHandlers}>{child}</PerfectScrollbar>}
              </div>
            ))}
        </div>
      </div>
      {steps && (
        <div ref={footerRef} className={classes.stepFooterWrapper}>
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
    backgroundColor: 'white',
  },
  stepFooter: {
    width: 'inherit',
    padding: 0,
    backgroundColor: 'white',
  },
  stepFooterWrapper: {
    position: 'relative',
  },
  outerWrapper: {
    position: 'relative', // was absolute: so that clip will work
    width: 'inherit',
    overflow: 'hidden',
    height: 'auto',
    clip: 'rect(0,auto,auto,0)', // to make sure the fixed position NavBar in a child is also hidden
    backgroundColor: 'inherit', // otherwise background is white
  },
  stepChildWrapper: {
    width: '100%',
    position: 'relative',
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
