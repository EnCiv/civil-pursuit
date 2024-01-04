'use strict'

// https://github.com/EnCiv/civil-pursuit/issues/46

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import Step from './step'
import SvgStepBarArrowPale from '../svgr/step-bar-arrow-pale'
import SvgStepBarSelectArrowOpen from '../svgr/step-bar-select-arrow-open'
import SvgStepBarSelectArrowClosed from '../svgr/step-bar-select-arrow-closed'
// import ReactScrollBar from './util/react-scrollbar'

function StepBar(props) {
  const { className, style, steps = [], current = 0, onDone = () => { }, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const stepRefs = steps.map(() => useRef(null))
  const stepContainerRef = useRef(null)
  const selectRef = useRef(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 50 * 16)
  const [isOpen, setIsOpen] = useState(false)
  const [stepGrid, setStepGrid] = useState({})

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

  // look at this some more... usememo? callback? and maybe change the .slice in the object to a more data-driven set
  const createStepGrid = useCallback(() => {
    if (stepContainerRef.current) {
      let containerWidth = stepContainerRef.current.offsetWidth;
      let totalWidth = 0;
      let grid = 1;
      let sliceStart = 0;
      let sliceEnd = 0;
      let dummyStepGrid = {};

      for (let i = 0; i < stepRefs.length; i++) {
        totalWidth += stepRefs[i].current.offsetWidth;
        sliceEnd += 1;
        if (sliceEnd === i + 1) {
          dummyStepGrid[`Grid${grid}`] = `slice(${sliceStart})`;
        }

        if (totalWidth >= containerWidth) {
          dummyStepGrid[`Grid${grid}`] = `slice(${sliceStart}, ${sliceEnd})`;
          sliceStart = sliceEnd;
          grid += 1;
          totalWidth = 0;
        }
      }


      setStepGrid(prevStepGrid => {
        // Compare values directly to avoid unnecessary updates
        if (
          Object.keys(dummyStepGrid).length === Object.keys(prevStepGrid).length &&
          Object.keys(dummyStepGrid).every(key => dummyStepGrid[key] === prevStepGrid[key])
        ) {
          return prevStepGrid;
        }
        return dummyStepGrid;
      });
    }
  }, [stepContainerRef, stepRefs]);

  const memoizedCreateStepGrid = useMemo(() => createStepGrid, [createStepGrid]);

  useLayoutEffect(() => {
    if (!isMobile) {
      memoizedCreateStepGrid();
      console.log(stepGrid)
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [memoizedCreateStepGrid, isMobile, handleResize, handleClickOutside]);

  // plan:
  // overflow prevents the rest of the steps from showing up
  // the arrows chagne the left and right positioning of the div
  // i think this is the best way to do it... check the unpoll repo
  // do this by measuring the width: of the div and dividing it into x sections: depending on the max widith/visiblity width
  // might need some sort of tracker to keep track of which 'page' you are on
  // will have to be dynamic: the screen resolution / parent width may change as the screen size changes
  // event listeners for screen resize
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
    display: 'inline-block',
    overflow: 'hidden',
    minWidth: 'fit-content',
    display: 'flex',
    minWidth: 'fit-content',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  // container: {
  //   display: 'flex',
  //   background: '#FFF',
  //   alignItems: 'center',
  //   maxHeight: '4.9375rem',
  // },

  // stepsContainer: {
  //   display: 'flex',
  //   padding: '0rem 0.625rem',
  //   height: '3.5rem',
  //   alignItems: 'center',
  //   overflow: 'hidden',
  //   justifyContent: 'flex-start',
  // },

  // stepDiv: {
  //   overflow: 'hidden',
  //   whiteSpace: 'nowrap',
  //   textOverflow: 'ellipsis',
  //   flexShrink: 0
  // },

  lastVisibleStep: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
