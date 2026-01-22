// https://github.com/EnCiv/civil-pursuit/issues/100
// https://github.com/EnCiv/civil-pursuit/issues/221
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import StatusBadge from './status-badge'
import Markdown from 'markdown-to-jsx'
import { useDeliberationContext } from './deliberation-context'

const QuestionBox = props => {
  const { className = '', subject = '', description = '', discussionId, contentAlign = 'center', tagline = '', minParticipants = 0, ...otherProps } = props
  const classes = useStylesFromThemeFunction({ ...props, contentAlign })
  const { data } = useDeliberationContext()
  const participants = data?.participants
  const badgeName = `${participants || 0} participant` + (participants > 1 ? 's' : '')
  const [status, setStatus] = useState(null)
  const detectStatus = event => {
    window.socket.emit('get-discussion-status', discussionId, status => {
      if (!status) return
      setStatus(status)
    })
  }

  return (
    <div className={cx(classes.questionBox, className)} {...otherProps}>
      <div className={classes.invisibleButtonInUpperRight} onClick={detectStatus} />
      <div className={classes.topic}>
        {tagline && <div className={classes.fixedText}>{tagline}</div>}
        <h1 className={classes.subject}>{subject}</h1>
        <div className={classes.description}>
          <Markdown>{description}</Markdown>
        </div>
      </div>
      {!!participants && participants >= minParticipants && (
        <div className={classes.participants}>
          <StatusBadge name={badgeName} status="" />
        </div>
      )}
      {status && (
        <div className={classes.status}>
          {Object.entries(status).map(([key, value]) => (
            <div key={key} className={classes.statusItem}>
              <strong>{key}:</strong> {typeof value !== undefined ? JSON.stringify(value, null, 2) : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  questionBox: {
    position: 'relative',
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
    marginBlockStart: '0',
    marginBlockEnd: '0',
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
    textAlign: 'left',
  },

  participants: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '1.6875rem',
  },
  status: {
    marginTop: '2rem',
  },
  invisibleButtonInUpperRight: {
    width: '1rem',
    height: '1rem',
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
    top: 0,
  },
}))

export default QuestionBox
