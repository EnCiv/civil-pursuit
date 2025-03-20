// https://github.com/EnCiv/civil-pursuit/issues/100
// https://github.com/EnCiv/civil-pursuit/issues/221
// https://github.com/EnCiv/civil-pursuit/issues/224

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import StatusBadge from './status-badge'
import Markdown from 'markdown-to-jsx'

const QuestionBox = props => {
  const { className = '', subject = '', description = '', contentAlign = 'center', tagline = '', children = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction({ ...props, contentAlign })

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <div className={classes.topic}>
        {tagline && <div className={classes.fixedText}>{tagline}</div>}
        <div className={classes.subject}>{subject}</div>
        <div className={classes.description}>
          <Markdown>{description}</Markdown>
        </div>
        <div className={classes.children}>
          {children?.map(row => (
            <div className={classes.row}>{row.length ? row.map(item => <div className={classes.item}>{item}</div>) : row}</div>
          ))}
        </div>
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
    flexDirection: 'column',
    alignItems: props => (props.contentAlign === 'center' ? 'center' : props.contentAlign === 'left' ? 'flex-start' : 'flex-end'),
    padding: '3.625rem 9.875rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '3.1875rem 1.5625rem',
      borderRadius: '0',
    },
  },

  topic: {
    textAlign: props => props.contentAlign,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  fixedText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '1.0625rem',
    lineHeight: '1.5625rem',
    letterSpacing: '0.01em',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
    whiteSpace: 'nowrap',
  },

  subject: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '3.75rem',
    lineHeight: '4.125rem',
    letterSpacing: '-0.03em',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '3rem',
      lineHeight: '3.3rem',
    },
  },

  description: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
  },
  children: {},
  row: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem 0',
  },
  item: {
    flex: 1,
  },
}))

export default QuestionBox
