'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/112

import React, { useState, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useCallback } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import shallowEqual from 'shallowequal'

import StepBar from './step-bar'
import StepFooter from './step-footer'

export const StepSlider = props => {
  const { children, onDone, steps, className, stepName, stepIntro, ...otherProps } = props // stepName and stepIntro are not used but are passed to children
  const classes = useStyles(props)
  const stepBarRef = useRef()
  const stepFooterRef = useRef()
  const outerRef = useRef()
  const panelRefs = useRef([])
  const stepChildRapper = useRef()
  const [outerRect, setOuterRect] = useState({ height: 0, width: 0 })
  const [_this] = useState({ timeout: 0, otherProps, onNexts: [] }) // _this object will exist through life of component so there is no setter it's like 'this'
  // resizeHandler needs to access outerRef and setOuterRec but never change so that the event can be removed
  // FTI resizeHandler gets called on initial render
  const resizeHandler = useCallback(() => {
    if (outerRef.current) {
      let rect = outerRef.current.getBoundingClientRect()
      if (rect.height && rect.width) {
        // there is an issue on smartphones when rotating from landscape to portrait where the screen ends up shows a split between two components
        // to work around this we are turning off transitions and then turning them back on after the viewport size stableizes
        if (_this.timeout) clearTimeout(_this.timeout)
        else dispatch({ type: 'transitionsOff' }) // careful - the value of transitions will never be changed inside this memorized callback
        _this.timeout = setTimeout(() => {
          if (outerRef.current) {
            // just to make sure
            let rect = outerRef.current.getBoundingClientRect()
            rect.clientWidth = outerRef.current.clientWidth // there may be a scrollbar on the right
            if (rect.height && rect.width) setOuterRect(rect)
          }
          dispatch({ type: 'transitionsOn' })
          _this.timeout = 0
        }, 100)
        setOuterRect(rect)
      }
    }
  }, [])

  // if window resizes we need to recalculate or so the boxes are same size as new viewport
  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  const stepNameToIndex = children.reduce((stepNameToIndex, child, index) => {
    const stepName = child.props.stepName || `step${index}`
    stepNameToIndex[stepName] = index
    return stepNameToIndex
  }, {})

  if (typeof window !== 'undefined') useLayoutEffect(resizeHandler, [outerRef.current])
  const [cachedChildren] = useState([])
  const sendDoneToParent = currentStep => {
    if (currentStep >= children.length - 1) setTimeout(() => onDone({ valid: currentStep === children.length - 1 }))
  }
  function reducer(state, action) {
    switch (action.type) {
      case 'transitionsOff':
        return { ...state, transitions: false }
      case 'transitionsOn':
        return { ...state, transitions: true }
      case 'moveTo':
        return { ...state, transitions: false, nextStep: action.to }

      case 'increment':
        return {
          ...state,
          transitions: false,
          nextStep: Math.min(state.currentStep + 1, children.length - 1),
        }

      case 'transitionBegin': {
        sendDoneToParent(state.currentStep)
        return {
          ...state,
          transitions: true,
          stepStatuses: state.stepStatuses?.map((stepStatus, i) => (i === state.currentStep ? { ...stepStatus, seen: true } : stepStatus)),
          currentStep: state.nextStep,
        }
      }
      case 'transitionComplete': {
        stepChildRapper.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return state // no need to rerender. leaving transitions on so that child components growing and shrinking will animate
      }
      case 'decrement': {
        return {
          ...state,
          nextStep: Math.max(0, state.currentStep - 1),
          transitions: false,
        }
      }
      case 'updateStatuses':
        let { valid, index } = action.payload
        if (steps) {
          const newState = { ...state, stepStatuses: state.stepStatuses.toSpliced(index, 1, { ...state.stepStatuses[index], complete: valid }) }
          return newState
        } else if (valid) {
          // Just increment if no steps
          const nextStep = Math.min(state.currentStep + 1, children.length - 1)
          sendDoneToParent(state.currentStep)
          return {
            ...state,
            transitions: false,
            nextStep,
          }
        } else {
          return state
        }
    }
  }
  // if the other props have changed, we need to rerender the children
  // _this.otherProps is only changed if it's shallow - different
  // _this is written directly because we don't want to cause another rerender - we just want to save the value for next time
  if (!shallowEqual(_this.otherProps, otherProps)) {
    _this.otherProps = otherProps
    // if otherProps changes, clone children again with new props
    for (let i = 0; i < children.length; i++) {
      if (cachedChildren[i]) {
        cachedChildren[i] = cloneChild(i)
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
  const [state, dispatch] = useReducer(reducer, { currentStep: 0, nextStep: 0, transitions: false, stepStatuses: steps })

  function cloneChild(currentStep) {
    return React.cloneElement(children[currentStep], {
      ...otherProps,
      ...children[currentStep].props,
      key: currentStep,
      onDone: ({ valid, value, onNext }) => {
        if (valid && typeof stepNameToIndex[value] === 'number') dispatch({ type: 'moveTo', to: stepNameToIndex[value] })
        else dispatch({ type: 'updateStatuses', payload: { valid, index: currentStep } })
        if (valid && onNext) _this.onNexts[currentStep] = onNext // save onNext for later use
        else delete _this.onNexts[currentStep] // delete onNext if not valid
      },
    })
  }

  // in the initial case, nextStep and currentStep will be 0 and the first child will be rendered
  if (!cachedChildren[state.nextStep]) {
    // if the next step, or any previous steps, are not present, we need to clone them before the render
    // moveTo can cause steps to be skipped, but the will need to be rendered to keep the panels in the right place
    for (let i = 0; i <= state.nextStep; i++) {
      if (!cachedChildren[i]) cachedChildren[i] = cloneChild(i)
    }
    // if the next step is not the current step, we need to clone it so it will be rendered
  }
  if (typeof window !== 'undefined')
    useLayoutEffect(() => {
      if (state.nextStep != state.currentStep) dispatch({ type: 'transitionBegin' })
    }, [state.nextStep])

  // ResizeObserver to update stepChildWrapper height when the current panel's height changes
  useEffect(() => {
    if (!panelRefs.current[state.currentStep] || !stepChildRapper.current) {
      return
    }
    const panel = panelRefs.current[state.currentStep]
    const wrapper = stepChildRapper.current
    const updateHeight = entries => {
      if (wrapper.style.height === panel.offsetHeight + 'px') return
      window.requestAnimationFrame(() => {
        wrapper.style.height = panel.offsetHeight + 'px'
      })
    }
    updateHeight()
    const resizeObserver = new window.ResizeObserver(updateHeight)
    resizeObserver.observe(panel)
    return () => {
      resizeObserver.disconnect()
    }
  }, [state.currentStep, panelRefs.current[state.currentStep], stepChildRapper.current])

  // listen for transitionComplete
  useEffect(() => {
    const wrapper = stepChildRapper.current
    if (!wrapper) return
    const handleTransitionEnd = e => {
      if (e.propertyName === 'left') {
        dispatch({ type: 'transitionComplete' })
      }
    }
    wrapper.addEventListener('transitionend', handleTransitionEnd)
    return () => {
      wrapper.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [stepChildRapper.current])

  return (
    <div className={className}>
      {steps && (
        <div className={classes.wrapper} ref={el => (stepBarRef.current = el)}>
          {state.stepStatuses.length > 0 && (
            <StepBar
              steps={state.stepStatuses}
              current={state.currentStep + 1}
              className={classes.navBar}
              onDone={onDoneResult => {
                if (onDoneResult.value) {
                  dispatch({ type: 'moveTo', to: onDoneResult.value - 1 }) // onDoneResult.value is 1-indexed, so we need to subtract 1
                }
              }}
            />
          )}
        </div>
      )}
      <div className={classes.outerWrapper} ref={outerRef}>
        <div
          ref={stepChildRapper}
          style={{
            left: -outerRect.width * state.currentStep + 'px',
            width: Math.max(outerRect.width, outerRect.clientWidth) * cachedChildren.length + 'px', // clientWidth is an integer and may get rounded up vs width in cases (desktop scaled monitor)
            height: panelRefs.current[state.currentStep]?.offsetHeight + 'px',
          }}
          className={cx(classes.stepChildWrapper, state.transitions && classes.transitions)}
        >
          {outerRect.width &&
            cachedChildren.map((child, i) => (
              <div
                key={i}
                style={{
                  width: outerRect.clientWidth + 'px',
                }}
                className={classes.panel}
                ref={el => (panelRefs.current[i] = el)}
              >
                {child}
              </div>
            ))}
        </div>
      </div>
      {steps && (
        <div className={classes.stepFooterWrapper} ref={el => (stepFooterRef.current = el)}>
          <StepFooter
            className={classes.stepFooter}
            onDone={() => {
              if (_this.onNexts[state.currentStep]) {
                const onNext = _this.onNexts[state.currentStep]
                delete _this.onNexts[state.currentStep] // only do it once
                setTimeout(onNext)
              }
              if (state.currentStep + 1 >= steps.length) onDone({ valid: true, value: 'done' })
              else dispatch({ type: 'increment' })
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
