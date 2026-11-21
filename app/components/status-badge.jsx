// https://github.com/EnCiv/civil-pursuit/issues/47
// https://github.com/EnCiv/civil-pursuit/issues/261
//https://github.com/EnCiv/civil-pursuit/issues/249

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export const getStatusPalette = (theme, status) => {
  switch (status?.toLowerCase()) {
    case 'error':
      return {
        border: theme.colors.statusBadgeErrorBorder,
        background: theme.colors.statusBadgeErrorBackground,
        color: theme.colors.statusBadgeErrorTextColor,
      }
    case 'complete':
    case 'done':
      return {
        border: theme.colors.statusBadgeCompletedBorder,
        background: theme.colors.statusBadgeCompletedBackground,
        color: theme.colors.statusBadgeCompletedTextColor,
      }
    case 'progress':
    case 'inprogress':
      return {
        border: theme.colors.statusBadgeProgressBorder,
        background: theme.colors.statusBadgeProgressBackground,
        color: theme.colors.statusBadgeProgressTextColor,
      }
    case 'inactive':
      return {
        border: theme.colors.statusBadgeInactiveBorder,
        background: theme.colors.statusBadgeInactiveBackground,
        color: theme.colors.encivGray,
      }
    case 'pending':
      return {
        border: theme.colors.secondaryDivider,
        background: theme.colors.lightGray,
        color: theme.colors.encivGray,
      }
    case 'response':
      return {
        border: 'transparent',
        background: 'transparent',
        color: theme.colors.statusBadgeResponseColor,
      }
    case 'warn':
      return {
        border: theme.colors.statusBoxWarnBorder,
        background: theme.colors.statusBoxWarnBackground,
        color: theme.colors.title,
      }
    case 'notice':
      return {
        border: theme.colors.statusBoxNoticeBorder,
        background: theme.colors.statusBoxNoticeBackground,
        color: theme.colors.title,
      }
    default:
      return {
        border: theme.colors.borderGray,
        background: theme.colors.white,
        color: theme.colors.title,
      }
  }
}

function StatusBadge(props) {
  const { style = {}, className = '', name = '', status = '', number = undefined, uniform = false, suppressHydrationWarning, ...otherProps } = props
  const classes = useStyles()

  return (
    <span className={cx(classes.container, classes[status.toLowerCase()], uniform && classes.uniform, className)} style={style} {...otherProps}>
      <span className={classes.status} suppressHydrationWarning={suppressHydrationWarning}>{name}</span>
      {number !== undefined && number !== null && <span className={classes.number} suppressHydrationWarning={suppressHydrationWarning}>{number}</span>}
    </span>
  )
}

const useStyles = createUseStyles(theme => ({
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    minHeight: '2.5rem',
    borderRadius: '9999px',
    borderWidth: theme.border.width.thin,
    borderStyle: 'solid',
    padding: '0.375rem 0.75rem',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  status: {
    fontWeight: 600,
    lineHeight: 1.2,
  },
  number: {
    fontWeight: 700,
    lineHeight: 1.2,
    marginLeft: '0.5rem',
  },
  uniform: {
    width: '9rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '8rem',
    },
  },
  progress: {
    borderColor: getStatusPalette(theme, 'progress').border,
    backgroundColor: getStatusPalette(theme, 'progress').background,
    color: getStatusPalette(theme, 'progress').color,
    fontWeight: '100',
  },
  complete: {
    borderColor: getStatusPalette(theme, 'complete').border,
    backgroundColor: getStatusPalette(theme, 'complete').background,
    color: getStatusPalette(theme, 'complete').color,
    fontWeight: '100',
  },
  inactive: {
    borderColor: getStatusPalette(theme, 'inactive').border,
    backgroundColor: getStatusPalette(theme, 'inactive').background,
    color: getStatusPalette(theme, 'inactive').color,
  },
  pending: {
    borderColor: getStatusPalette(theme, 'pending').border,
    backgroundColor: getStatusPalette(theme, 'pending').background,
    color: getStatusPalette(theme, 'pending').color,
  },
  response: {
    border: `none !important`,
    color: getStatusPalette(theme, 'response').color,
  },
  error: {
    borderColor: getStatusPalette(theme, 'error').border,
    backgroundColor: getStatusPalette(theme, 'error').background,
    color: getStatusPalette(theme, 'error').color,
    fontWeight: '100',
  },
}))

export default StatusBadge
