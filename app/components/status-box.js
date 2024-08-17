// https://github.com/EnCiv/civil-pursuit/issues/192

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

function StatusBox(props) {
  const { className, status = '', subject = '', ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  let leadText
  if (status === 'error') {
    leadText = 'Oops!'
  }
  if (status === 'done') {
    leadText = 'Finished!'
  }
  if (status === 'warn') {
    leadText = 'Please Review'
  }
  if (status === 'notice') {
    leadText = 'Notice'
  } else {
    console.error(`${status} is not a valid status for StatusBox.`)
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.subject}>
        <span className={classes.leadText}>{leadText}</span>
        {subject}
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: props => ({
    padding: '1rem',
    width: '100%',
    boxShadow: theme.boxShadow,
    backgroundColor: (() => {
      if (props.status === 'error') {
        return theme.colors.statusBoxErrorBackground
      }
      if (props.status === 'done') {
        return theme.colors.statusBoxDoneBackground
      }
      if (props.status === 'warn') {
        return theme.colors.statusBoxWarnBackground
      }
      if (props.status === 'notice') {
        return theme.colors.statusBoxNoticeBackground
      } else {
        return theme.colors.colorPrimary
      }
    })(),
  }),
  subject: {
    ...theme.font,
  },
  leadText: {
    fontWeight: 'bold',
    padding: '0rem 0.5rem',
  },
}))

export default StatusBox
