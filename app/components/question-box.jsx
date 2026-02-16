// https://github.com/EnCiv/civil-pursuit/issues/100
// https://github.com/EnCiv/civil-pursuit/issues/221
// https://github.com/EnCiv/civil-pursuit/issues/224

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Markdown from 'markdown-to-jsx'

const QuestionBox = props => {
  const { className = '', subject = '', description = '', contentAlign = 'center', tagline = '', children = [], compact = false, ...otherProps } = props
  const classes = useStylesFromThemeFunction({ ...props, contentAlign, compact })

  return (
    <div className={cx(classes.questionBox, className)} {...otherProps}>
      <div className={classes.topic}>
        {tagline && <div className={classes.fixedText}>{tagline}</div>}
        <h1 className={classes.subject}>{subject}</h1>
        <div className={classes.description}>
          <Markdown>{description}</Markdown>
        </div>
        <div className={classes.children}>
          {React.Children.map(children, (child, index) =>
            child
              ? React.cloneElement(child, {
                  key: index,
                  ...child.props,
                  className: cx(child.props?.className, classes.item, classes[`align${contentAlign.charAt(0).toUpperCase() + contentAlign.slice(1)}`]),
                })
              : null
          )}
        </div>
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  questionBox: {
    position: 'relative',
    borderRadius: props => (props.compact ? '1rem' : '1.875rem'),
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: props => (props.contentAlign === 'center' ? 'center' : props.contentAlign === 'left' ? 'flex-start' : 'flex-end'),
    padding: props => (props.compact ? '2rem 3rem' : '3.625rem 9.875rem'),
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: props => (props.compact ? '1rem 0.75rem' : '3.1875rem 1.5625rem'),
      borderRadius: '0',
    },
  },

  topic: {
    textAlign: props => props.contentAlign,
    display: 'flex',
    flexDirection: 'column',
    gap: props => (props.compact ? '1rem' : '1.5rem'),
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: props => (props.compact ? '0.75rem' : '1.5rem'),
    },
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
    marginBlockStart: '0',
    marginBlockEnd: '0',
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: props => (props.compact ? '2rem' : '3.75rem'),
    lineHeight: props => (props.compact ? '2.5rem' : '4.125rem'),
    letterSpacing: '-0.03em',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: props => (props.compact ? '1.25rem' : '1.5rem'),
      lineHeight: props => (props.compact ? '1.75rem' : '2rem'),
    },
  },

  description: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'left',
  },
  children: {
    display: 'flex',
    flexDirection: 'column',
    gap: props => (props.compact ? '1.5rem' : '2.5rem'),
    padding: props => (props.compact ? '0.75rem 0' : '1rem 0'),
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: props => (props.compact ? '1rem' : '2.5rem'),
      padding: props => (props.compact ? '0.5rem 0' : '1rem 0'),
    },
  },
  item: {
    display: 'flex',
    flex: 1,
    gap: '1rem',
  },
  alignCenter: {
    justifyContent: 'center',
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
}))

export default QuestionBox
