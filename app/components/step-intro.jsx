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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    paddingBottom: '4.375rem',
    borderBottom: `1px solid ${theme.colors.secondaryDivider}`,
  },

  title: {
    color: theme.colors.primaryButtonBlue,
    fontSize: '2.25rem',
    fontWeight: 300,
    lineHeight: '2.9375rem',
    fontFamily: 'Inter',
  },

  paragraph: {
    color: theme.colors.title,
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: '1.875rem',
    fontFamily: 'Inter',
  },
}))

export default StepIntro
