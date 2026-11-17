// https://github.com/EnCiv/civil-pursuit/issues/50
// https://github.com/EnCiv/civil-pursuit/issues/80

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { H } from 'react-accessible-headings'

const StepIntro = props => {
  const { className = '', subject = '', description = '', ...otherProps } = props

  const classes = stepIntroStyles()

  const paragraphs = description.split('\\n').map((paragraph, index) => (
    <p className={classes.paragraph} key={index}>
      {paragraph}
    </p>
  ))

  return (
    <div className={cx(classes.stepIntro, className)} {...otherProps}>
      <H className={classes.title}>{subject}</H>
      {paragraphs}
    </div>
  )
}

// Styles for the StepIntro component using react-jss
const stepIntroStyles = createUseStyles(theme => ({
  stepIntro: {
    // Add your common styles here
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontStyle: 'normal',
    paddingBottom: '3rem',
    borderBottom: `1px solid ${theme.colors.secondaryDivider}`,
    animation: '$introRise 520ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      paddingBottom: '1.25rem',
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },

  title: {
    color: theme.colors.primaryButtonBlue,
    fontSize: '3rem',
    fontWeight: 600,
    lineHeight: 1.12,
    fontFamily: `${theme.font.headingFontFamily}, Georgia, serif`,
    margin: '0 0 1rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '2rem',
    },
  },

  paragraph: {
    color: theme.colors.title,
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.7,
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    maxWidth: '68ch',
    margin: '0.75rem 0 0',
  },

  '@keyframes introRise': {
    from: {
      opacity: 0,
      transform: 'translateY(0.65rem)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}))

export default StepIntro
