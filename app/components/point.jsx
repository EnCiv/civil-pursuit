// https://github.com/EnCiv/civil-pursuit/issues/23

'use strict'
import React, { useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function Point(props) {
  const { subject, description, vState, children, styles, className, ...otherProps } = props

  const [isHovered, setIsHovered] = useState(false)

  const classes = useStylesFromThemeFunction()

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const childrenWithProps = React.Children.map(children?.props?.children ?? children, child => {
    return React.cloneElement(child, {
      isHovered: isHovered,
      vState: vState,
    })
  })

  const borderClass = cx(classes[`${vState}Border`])
  const subjectClass = cx(classes[`${vState}Subject`])
  const descriptionClass = cx(classes[`${vState}Description`])

  return (
    <>
      <div className={className} style={styles}>
        <div className={borderClass} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className={classes.contentContainer}>
            <div className={classes.informationGrid}>
              <div className={subjectClass}>{subject}</div>
              <div className={descriptionClass}>{description}</div>
              {childrenWithProps}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  contentContainer: {
    padding: '2.1875rem 1.875rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.625rem',
  },

  informationGrid: {
    display: 'flex',
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
  },
  mouseDownBorder: {
    outline: '0.1875rem solid #005621',
    background: '#E6F3EB',
    '& $informationGrid': {
      color: '#005621 !important',
    },
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
}))

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

export default Point

/*
NOTES:
- vState comes in as 'default', 'mouseDown', or 'disabled'

- if multiple children are passed into this comopnent, then they must be siblings:
  Good Example: 
      children: (
      <>
        <DemInfo />
        <PointLeadButton vState="default" />
      </>
    )

  Wrong Example:
    children: (
      <>
        <div>
          <DemInfo />
        </div>
        <div>
          <PointLeadB utton vState="default" />
        </div>
      </>
    )
*/
