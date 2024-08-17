// https://github.com/EnCiv/civil-pursuit/issues/192

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import SvgAlertTriangle from '../svgr/alert-triangle'
import SvgCheckedCircle from '../svgr/checked-circle'
import SvgWarningTriangle from '../svgr/warning-triangle'
import SvgNoticeCircle from '../svgr/notice-circle'

function StatusBox(props) {
  const { className, status = '', subject = '', description = '', ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  let leadText
  let Icon
  if (status === 'error') {
    Icon = SvgAlertTriangle
  }
  if (status === 'done') {
    Icon = SvgCheckedCircle
  }
  if (status === 'warn') {
    Icon = SvgWarningTriangle
  }
  if (status === 'notice') {
    Icon = SvgNoticeCircle
  } else {
    console.error(`${status} is not a valid status for StatusBox.`)
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.message}>
        {Icon && <Icon className={classes.icon} />}
        <span className={classes.subject}>{subject}</span>
        {description}
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: props => ({
    padding: '1rem',
    width: 'auto',
    boxShadow: theme.boxShadow,
    borderRadius: '0.5rem',
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
    border: `0.125rem solid ${(() => {
      if (props.status === 'error') {
        return theme.colors.statusBoxErrorBorder
      }
      if (props.status === 'done') {
        return theme.colors.statusBoxDoneBorder
      }
      if (props.status === 'warn') {
        return theme.colors.statusBoxWarnBorder
      }
      if (props.status === 'notice') {
        return theme.colors.statusBoxNoticeBorder
      } else {
        return ''
      }
    })()}`,
  }),

  message: {
    ...theme.font,
    display: 'flex',
    alignItems: 'center',
  },
  subject: {
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
