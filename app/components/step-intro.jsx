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
    <p className={classes.secondaryText} key={index}>
      {paragraph}
    </p>
  ))

  return (
    <div className={cx(classes.stepIntro, className)} {...otherProps}>
      {subject && <H className={classes.primaryText}>{subject}</H>}
      {paragraphs}
    </div>
  )
}

// Styles for the StepIntro component using react-jss
const stepIntroStyles = createUseStyles(theme => ({
  stepIntro: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontStyle: 'normal',
    paddingBottom: '3rem',
    animation: `$introRise ${theme.motion.intro} ${theme.motion.introEase} both`,
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      paddingBottom: '1.25rem',
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },

  primaryText: {
    width: 'fit-content',
    maxWidth: '24ch',
    color: theme.colors.primaryButtonBlue,
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.12,
    fontFamily: `${theme.font.headingFontFamily}, Georgia, serif`,
    margin: '0 0 1rem',
    textWrap: 'balance',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '2rem',
    },
  },

  secondaryText: {
    width: '100%',
    color: theme.colors.encivGray,
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.65,
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    maxWidth: '66ch',
    margin: '0.75rem auto 0',
    textAlign: 'center',
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
