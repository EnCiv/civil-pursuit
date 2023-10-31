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
    outline: `1px solid ${theme.colors.borderGray}`,
    background: theme.colors.white,
    ...sharedBorderStyles,
    '&:hover': {
      outline: `0.1875rem solid ${theme.colors.success}`,
    },
    '&:hover $defaultSubject': {
      color: theme.colors.success,
    },
    '&:hover $defaultDescription': {
      color: theme.colors.success,
    },
  },
  mouseDownBorder: {
    outline: `0.1875rem solid ${theme.colors.success}`,
    background: theme.colors.lightSuccess,
    '& $informationGrid': {
      color: theme.colors.success,
    },
    ...sharedBorderStyles,
  },
  disabledBorder: {
    opacity: 0.5,
    outline: `1px solid ${theme.colors.borderGray}`,
    background: theme.colors.white,
    ...sharedBorderStyles,
  },

  // subject states
  defaultSubject: {
    color: theme.colors.title,
    ...sharedSubjectSyles,
  },
  mouseDownSubject: {
    color: theme.colors.success,
    ...sharedSubjectSyles,
  },
  disabledSubject: {
    color: theme.colors.title,
    ...sharedSubjectSyles,
  },

  // description states
  defaultDescription: {
    color: theme.colors.title,
    ...sharedDescriptionStyles,
  },
  mouseDownDescription: {
    color: theme.colors.success,
    ...sharedDescriptionStyles,
  },
  disabledDescription: {
    color: theme.colors.title,
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
  fontStyle: 'normal',
  fontSize: '1.25rem',
  fontWeight: '400',
  lineHeight: '1.875rem',
}

const sharedDescriptionStyles = {
  fontFamily: 'Inter',
  fontStyle: 'normal',
  alignSelf: 'stretch',
  fontSize: '1rem',
  fontWeight: '400',
  lineHeight: '1.5rem',
}

export default Point

/*
NOTES:
- vState comes in as 'default', 'mouseDown', or 'disabled'

- We chose to implement a hover state passed individually to each child (refer to lines 23-28). 
  This decision was made because hovering over the point component also affects the styling of its children. 
  For instance, when you hover over the point component, it underlines the text within the point-lead-button. 
  This approach aligns with React JSS styling, which confines styling to the component where it's defined.
  Note that if multiple children are passed into this comopnent, then they must be siblings:
  
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
