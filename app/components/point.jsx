// https://github.com/EnCiv/civil-pursuit/issues/23

'use strict'
import React from 'react'
import cx from 'classnames'
import insertSheet from 'react-jss'

function Point(props) {
  const { subject, description, vState, children, styles, className, classes, ...otherProps } = props

  return (
    <>
      <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />

      <div className={cx(className)} style={styles}>
        <div className={cx(classes[`${vState}Border`])}>
          <div className={cx(classes.contentContainer)}>
            <div className={cx(classes.informationGrid)}>
              <div className={cx(classes[`${vState}Subject`])}>{subject}</div>
              <div className={cx(classes[`${vState}Description`])}>{description}</div>
              <div>
                {vState !== 'disabled' && 'DemInfo component goes here'}
                {/* <DemInfo {...otherProps} /> */}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const sharedBorderStyles = {
  borderRadius: '0.9375rem',
  maxWidth: '33.5625rem',
  boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
}

const sharedSubjectSyles = {
  fontFamily: 'Inter',
  fontSize: '1.25rem',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '1.875rem',
}

const sharedDescriptionStyles = {
  alignSelf: 'stretch',
  fontFamily: 'Inter',
  fontSize: '1rem',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '1.5rem',
}

const pointStyles = {
  contentContainer: {
    padding: '2.1875rem 1.875rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.625rem',
  },

  informationGrid: {
    display: 'flex',
    // padding: var(--Response-Selected, 0px); // does padding change upon selections/input? -figma
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.9375rem',
    alignSelf: 'stretch',
  },

  // border states
  defaultBorder: {
    outline: '1px solid #EBEBEB',
    background: '#FFF',
    ...sharedBorderStyles,
    '&:hover': {
      outline: '0.1875rem solid #005621',
    },
    '&:hover $defaultSubject': {
      color: '#005621 !important',
    },
    '&:hover $defaultDescription': {
      color: '#005621 !important',
    },
    '&:hover $defaultButton': {
      color: 'red',
      textDecorationLine: 'underline',
    },
  },
  mouseDownBorder: {
    outline: '0.1875rem solid #005621',
    background: '#E6F3EB',
    ...sharedBorderStyles,
  },
  disabledBorder: {
    opacity: 0.5,
    outline: '1px solid #EBEBEB',
    background: '#FFF',
    ...sharedBorderStyles,
  },

  // subject states
  defaultSubject: {
    color: '#1A1A1A',
    ...sharedSubjectSyles,
  },
  mouseDownSubject: {
    color: '#005621',
    ...sharedSubjectSyles,
  },
  disabledSubject: {
    color: '#1A1A1A',
    ...sharedSubjectSyles,
  },

  // description states
  defaultDescription: {
    color: '#1A1A1A',
    ...sharedDescriptionStyles,
  },
  mouseDownDescription: {
    color: '#005621',
    ...sharedDescriptionStyles,
  },
  disabledDescription: {
    color: '#1A1A1A',
    ...sharedDescriptionStyles,
  },
}

export default insertSheet(pointStyles)(Point)

// DEV NOTES:
/*
- The css styling object is called pointStyles. This is 'injected' into the Point component through insertSheet(), from React jss.
- It is accessed through the 'classes' prop.
- React jss is the tool we are using to write css in react components.
- To use the style, we use cx function from the 'classnames' library
    Example:   <div className={cx(classes[`${vState}Border`])}>
  Let's break this down:
  1. cx - the method used to make the js styling objects usable
  2. classes - the prop injected into the component. it contains the styling (see bullet one and two)
  3. [`${vState}Border`] - this accesses the desired styling from the pointStyles object. For example, if vState = 'default', then the styling applied will be defaultBorder
- the different states are seen in the story through the vState argument. I assume this is how it will work in production... open to other ideas!!
REACT.JSS CHEAT SHEET:
https://pantaley.com/blog/Start-your-JSS-journey-with-the-selectors-cheat-sheet/
*/

// julian's notes:
// note that certain things will change based on input, example the border of moreCommonStyles. look into vars on figma.... may need to use css variables. or this: https://cssinjs.org/react-jss/?v=v10.10.0#dynamic-values
// need better solution for importing the font
// the box shadow looks a lot bigger in the story than it does in the figma. I think this is becasue the figma background is slightly gray, making the border blend, and therefore seem smaller.
// ^^ That being said, maybe we should decrease the box shadow? looks a bit big against the white background
// classes prop is the pointStyles styling
// note: i used the outline property instead of the border property to prevent the size and positioning from changing upon a hover. do we want it to move?
// hover state for the subject isn't working (and probably description too). we should look into the proper way to do it with react jss, otherwise we might have to think of other solutions
// disabled/inactive component is less wide than the other ones in the figma. Is this intentional? Also doesn't have the DomInfo
// Card Shadow - Desktop - what does this mean? Select a LEad, Desktop
// am i using vState properly? I'm assuming it will be passed down as a prop from a higher component. Unless its the name of pointStyles object?
// hover state on the button
// slight top padding on point lead button - add
// different width for choosing lead response?

// future issues:
// create DemInfo componenent ... specify what it takes in, etc...
// finish the lead button component... what does it take in? what does it do?
