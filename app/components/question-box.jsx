// https://github.com/EnCiv/civil-pursuit/issues/100
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import StatusBadge from './status-badge'
import Markdown from 'markdown-to-jsx'

const QuestionBox = props => {
  const { className = '', subject = '', description = '', participants = 0, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const badgeName = `${participants} participants`

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <div className={classes.topic}>
        <div className={classes.fixedText}>Civil Pursuit</div>
        <div className={classes.subject}>{subject}</div>
        <div className={classes.description}>
          <Markdown>{description}</Markdown>
        </div>
      </div>
      <div className={classes.participants}>
        <StatusBadge name={badgeName} status="" />
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    borderRadius: '1.875rem',
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    backgroundColor: 'rgba(235, 235, 235, 0.4)',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3.625rem 9.875rem',
  },

  topic: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },

  fixedText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '1.0625rem',
    lineHeight: '1.5625rem',
    letterSpacing: '0.01em',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  subject: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '3.75rem',
    lineHeight: '4.125rem',
    letterSpacing: '-0.03em',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'center',
  },
  participants: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '1.6875rem',
  },
}))

export default QuestionBox
