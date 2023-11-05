// https://github.com/EnCiv/civil-pursuit/issues/23

'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function Point(props) {
  const { subject, description, vState, children, className, ...otherProps } = props

  const classes = useStylesFromThemeFunction()

  const borderClass = classes[`${vState}Border`]
  const subjectClass = classes[`${vState}Subject`]
  const descriptionClass = classes[`${vState}Description`]

  const childrenWithProps = React.Children.map(children?.props?.children ?? children, child => {
    return React.cloneElement(child, {
      className: className,
      vState: vState,
    })
  })

  return (
    <>
      <div className={cx(classes.sharedBorderStyle, borderClass, className)} {...otherProps}>
        <div className={classes.contentContainer}>
          <div className={classes.informationGrid}>
            {subject && <div className={cx(classes.sharedSubjectStyle, subjectClass)}>{subject}</div>}
            {description && <div className={cx(classes.sharedDescriptionStyle, descriptionClass)}>{description}</div>}
            {childrenWithProps}
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
    '&:hover': {
      outline: `0.1875rem solid ${theme.colors.success}`,
    },
    '&:hover $defaultSubject': {
      color: theme.colors.success,
    },
    '&:hover $defaultDescription': {
      color: theme.colors.success,
    },
    // here is the styling for the children's hover states:
    '&:hover .leadButton': {
      backgroundColor: theme.colors.white,
      color: theme.colors.textBrown,
      borderColor: theme.colors.encivYellow,
      textDecorationLine: 'underline',
      textUnderlineOffset: '0.25rem',
    },
  },
  selectedBorder: {
    outline: `0.1875rem solid ${theme.colors.success}`,
    background: theme.colors.lightSuccess,
    '& $informationGrid': {
      color: theme.colors.success,
    },
  },
  disabledBorder: {
    opacity: 0.5,
    outline: `1px solid ${theme.colors.borderGray}`,
    background: theme.colors.white,
  },
  collapsedBorder: {
    borderRadius: '0 !important',
    boxShadow: 'none !important',
    backgroundColor: 'rgba(235, 235, 235, 0.30)',
    '& $contentContainer': {
      padding: '1.25rem',
    },
  },

  // subject states
  defaultSubject: {
    color: theme.colors.title,
  },
  selectedSubject: {
    color: theme.colors.success,
  },
  disabledSubject: {
    color: theme.colors.title,
  },
  collapsedSubject: {
    color: theme.colors.title,
    ...theme.font,
    fontSize: '1rem !important',
    fontWeight: '400',
    lineHeight: '1.5rem !important',
  },

  // description states
  defaultDescription: {
    color: theme.colors.title,
  },
  selectedDescription: {
    color: theme.colors.success,
  },
  disabledDescription: {
    color: theme.colors.title,
  },

  // shared styling
  sharedBorderStyle: {
    borderRadius: '0.9375rem',
    boxShadow: '0.1875rem 0.1875rem 0.4375rem 0.5rem rgba(217, 217, 217, 0.40)',
  },
  sharedSubjectStyle: {
    ...theme.font,
    fontSize: '1.25rem',
    fontWeight: '400',
    lineHeight: '1.875rem',
  },
  sharedDescriptionStyle: {
    ...theme.font,
    alignSelf: 'stretch',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
  },
}))

export default Point

/*
NOTES:
- vState comes in as 'default', 'selected', 'disabled', or 'collapsed'

- Note that if multiple children are passed into this comopnent, then they must be siblings:
  
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
