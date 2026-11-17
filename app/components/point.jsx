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
import DemInfo from './dem-info'

const Point = forwardRef((props, ref) => {
  const { point, vState = 'default', children = [], className = '', isLoading, isInvalid, topRow, demInfoTopRight = false, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const [isHovered, setIsHovered] = useState(false)

  const { subject = '', description = '', _id } = point || {}

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
    <div className={cx(classes.sharedBorderStyle, classes[vState + 'Border'], className)} {...otherProps} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut} ref={ref}>
      <div className={classes.contentContainer}>
        {(topRow || demInfoTopRight) && (
          <div className={classes.topRow}>
            {topRow}
            {demInfoTopRight && <DemInfo className={classes.topRightDemInfo} pointId={_id} />}
          </div>
        )}
        <div className={classes.informationGrid}>
          {(isLoading || subject) && (
            <H className={isLoading ? cx(classes.loadingAnimation, classes.loadingAnimationSubject) : cx(classes.sharedSubjectStyle, classes[vState + 'Subject'], isInvalid ? classes.invalidText : undefined)}>{isLoading ? '' : subject}</H>
          )}
          {(isLoading || description) && (
            <p className={isLoading ? cx(classes.loadingAnimation, classes.loadingAnimationDescription) : cx(classes.sharedDescriptionStyle, classes[vState + 'Description'], isInvalid ? classes.invalidText : undefined)}>
              {isLoading ? '' : description}
            </p>
          )}
          {!demInfoTopRight && <DemInfo className={cx(classes[vState + 'DemInfo'])} pointId={_id} />}
          <Level>{childrenWithProps}</Level>
        </div>
      </div>
    </div>
  )
})

const useStylesFromThemeFunction = createUseStyles(theme => ({
  contentContainer: {
    padding: '1.5rem 1.875rem',
    paddingBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.625rem',
  },

  topRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '0.5rem',
  },

  topRightDemInfo: {
    marginLeft: 'auto',
    marginRight: '2.5rem',
    textAlign: 'right',
  },

  informationGrid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0',
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
  },
  selectedBorder: {
    outline: `0.1875rem solid ${theme.colors.success}`,
    borderColor: theme.colors.success,
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
      padding: '0.25rem 1.25rem',
    },
  },
  secondaryBorder: {
    borderRadius: '0.75rem',
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
  secondarySubject: {
    color: theme.colors.title,
  },

  // description states
  defaultDescription: {
    color: theme.colors.encivGray,
  },
  selectedDescription: {
    color: theme.colors.success,
  },
  disabledDescription: {
    color: theme.colors.encivGray,
  },
  secondaryDescription: {
    color: theme.colors.encivGray,
  },
  collapsedDescription: {
    display: 'none',
  },

  // demInfo states
  defaultDemInfo: {
    color: theme.colors.title,
  },
  selectedDemInfo: {
    color: theme.colors.success,
  },
  disabledDemInfo: {
    color: theme.colors.title,
  },
  collapsedDemInfo: {
    display: 'none',
  },

  // shared styling
  sharedBorderStyle: {
    border: '0.0625rem solid rgba(217, 217, 217, 0.8)',
    borderRadius: '0.75rem',
    boxShadow: '0 0.125rem 0 rgba(26, 26, 26, 0.05), 0 0.5rem 1rem rgba(6, 51, 92, 0.1)',
    paddingBottom: '0.5rem',
    transition: 'box-shadow 180ms ease, transform 180ms ease',
    '&:hover': {
      boxShadow: '0 0.2rem 0 rgba(26, 26, 26, 0.06), 0 0.75rem 1.25rem rgba(6, 51, 92, 0.14)',
      transform: 'translateY(-0.08rem)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': {
        transform: 'none',
      },
    },
  },
  sharedSubjectStyle: {
    ...theme.font,
    fontFamily: `${theme.font.headingFontFamily}, Georgia, serif`,
    fontSize: '1.375rem',
    fontWeight: 600,
    marginBlockStart: '0.25rem',
    lineHeight: 1.3,
    marginBlockEnd: '0.5rem',
  },
  sharedDescriptionStyle: {
    ...theme.font,
    alignSelf: 'stretch',
    fontSize: '0.9375rem',
    fontWeight: '400',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    marginBottom: '0.25rem',
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
