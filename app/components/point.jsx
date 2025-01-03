// https://github.com/EnCiv/civil-pursuit/issues/23
// https://github.com/EnCiv/civil-pursuit/issues/76
// https://github.com/EnCiv/civil-pursuit/issues/80
// https://github.com/EnCiv/civil-pursuit/issues/140
// https://github.com/EnCiv/civil-pursuit/issues/251

'use strict'
import React, { forwardRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { H, Level } from 'react-accessible-headings'
import DemInfo from './dem-info.jsx'

const Point = forwardRef((props, ref) => {
  const { point, vState = 'default', children = [], className = '', isLoading, isInvalid, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const [isHovered, setIsHovered] = useState(false)

  const { subject = '', description = '', demInfo = {} } = point || {}

  const onMouseIn = () => {
    setIsHovered(true)
  }

  const onMouseOut = () => {
    setIsHovered(false)
  }

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        className: cx(child.props.className, { isHovered: isHovered }),
        vState: vState,
      })
    }
    return child
  })

  return (
    <div
      className={cx(classes.sharedBorderStyle, classes[vState + 'Border'], className)}
      {...otherProps}
      onMouseEnter={onMouseIn}
      onMouseLeave={onMouseOut}
      ref={ref}
    >
      <div className={classes.contentContainer}>
        <div className={classes.informationGrid}>
          {(isLoading || subject) && (
            <H
              className={
                isLoading
                  ? cx(classes.loadingAnimation, classes.loadingAnimationSubject)
                  : cx(
                      classes.sharedSubjectStyle,
                      classes[vState + 'Subject'],
                      isInvalid ? classes.invalidText : undefined
                    )
              }
            >
              {isLoading ? '' : subject}
            </H>
          )}
          {(isLoading || description) && (
            <p
              className={
                isLoading
                  ? cx(classes.loadingAnimation, classes.loadingAnimationDescription)
                  : cx(
                      classes.sharedDescriptionStyle,
                      classes[vState + 'Description'],
                      isInvalid ? classes.invalidText : undefined
                    )
              }
            >
              {isLoading ? '' : description}
            </p>
          )}
          <DemInfo {...demInfo} />
          <Level>{childrenWithProps}</Level>
        </div>
      </div>
    </div>
  )
})

const useStylesFromThemeFunction = createUseStyles(theme => ({
  contentContainer: {
    padding: '1.5rem 1.875rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.625rem',
  },

  informationGrid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0rem',
    alignSelf: 'stretch',
  },

  // animation states
  loadingAnimation: {
    animation: '$loadingAnimation_keyframes 1s linear infinite forwards',
    background: '#f6f7f8',
    backgroundImage: 'linear-gradient(to right, #eee 8%, #ddd 18%, #eee 33%)',
    backgroundSize: 'inherit',
    position: 'relative',
    width: '100%',
    marginBottom: '0.625rem',
  },
  loadingAnimationSubject: {
    height: '2rem',
  },
  // 30rem should not effect the size responsiveness of the point
  // It affects the animation speed, not the width of the background
  loadingAnimationDescription: { height: '3rem' },

  '@keyframes loadingAnimation_keyframes': {
    '0%': {
      backgroundPosition: '-30rem 0',
    },
    '100%': {
      backgroundPosition: '30rem 0',
    },
  },
  '@-webkit-keyframes loadingAnimation_keyframes': {
    '0%': {
      backgroundPosition: '-30rem 0',
    },
    '100%': {
      backgroundPosition: '30rem 0',
    },
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
  secondaryBorder: {
    borderRadius: '0 !important',
    boxShadow: 'none !important',
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
  secondarySubject: {},

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
    boxShadow: theme.none,
  },
  sharedSubjectStyle: {
    ...theme.font,
    fontSize: '1.25rem',
    fontWeight: '400',
    lineHeight: '1rem',
  },
  sharedDescriptionStyle: {
    ...theme.font,
    alignSelf: 'stretch',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
  },
  invalidText: {
    color: theme.colors.rankInvalidText,
  },
}))

export default Point

/*
NOTES:
- vState comes in as 'default', 'selected', 'disabled', 'collapsed', 'loading', or 'secondary'

- Note that if multiple children are passed into this component, then they must be siblings:

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
          <PointLeadButton vState="default" />
        </div>
      </>
    )
*/
