// https://github.com/EnCiv/civil-pursuit/issues/192

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { getStatusPalette } from './status-badge'

import SvgAlertTriangle from '../svgr/alert-triangle'
import SvgCheckedCircle from '../svgr/checked-circle'
import SvgWarningTriangle from '../svgr/warning-triangle'
import SvgNoticeCircle from '../svgr/notice-circle'

const statusToIcon = {
  error: SvgAlertTriangle,
  done: SvgCheckedCircle,
  warn: SvgWarningTriangle,
  notice: SvgNoticeCircle,
}

function StatusBox(props) {
  const { className, status = '', subject = '', description = '', ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  let Icon = statusToIcon[status]
  if (!status) console.error(`${status} is not a valid status for StatusBox.`)

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
    display: 'inline-flex',
    boxShadow: theme.boxShadow,
    borderRadius: '0.5rem',
    backgroundColor: getStatusPalette(theme, props.status).background,
    border: `0.125rem solid ${getStatusPalette(theme, props.status).border}`,
  }),
  message: props => ({
    ...theme.font,
    display: 'flex',
    alignItems: 'center',
    color: getStatusPalette(theme, props.status).color,
  }),
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
