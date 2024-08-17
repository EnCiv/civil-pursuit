// https://github.com/EnCiv/civil-pursuit/issues/192

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import SvgAlertTriangle from '../svgr/alert-triangle'
import SvgCheckedCircle from '../svgr/checked-circle'
import SvgWarningTriangle from '../svgr/warning-triangle'
import SvgNoticeCircle from '../svgr/notice-circle'

function StatusBox(props) {
  const { className, status = '', subject = '', ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  let leadText
  let Icon
  if (status === 'error') {
    leadText = 'Oops!'
    Icon = SvgAlertTriangle
  }
  if (status === 'done') {
    leadText = 'Finished!'
    Icon = SvgCheckedCircle
  }
  if (status === 'warn') {
    leadText = 'Please Review'
    Icon = SvgWarningTriangle
  }
  if (status === 'notice') {
    leadText = 'Notice'
    Icon = SvgNoticeCircle
  } else {
    console.error(`${status} is not a valid status for StatusBox.`)
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.subject}>
        {Icon && <Icon className={classes.icon} />}
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
    display: 'flex',
    alignItems: 'center',
  },
  leadText: {
    fontWeight: 'bold',
    padding: '0rem 1rem',
  },
  icon: {
    width: '1.5rem',
    height: 'auto',
    top: '50%',
  },
}))

export default StatusBox
