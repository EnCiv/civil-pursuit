// https://github.com/EnCiv/civil-pursuit/issues/47
// https://github.com/EnCiv/civil-pursuit/issues/261
//https://github.com/EnCiv/civil-pursuit/issues/249

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

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
    borderColor: theme.colors.statusBadgeProgressBorder,
    backgroundColor: theme.colors.statusBadgeProgressBackground,
    color: theme.colors.statusBadgeProgressTextColor,
    fontWeight: '100',
  },
  complete: {
    borderColor: theme.colors.statusBadgeCompletedBorder,
    backgroundColor: theme.colors.statusBadgeCompletedBackground,
    color: theme.colors.statusBadgeCompletedTextColor,
    fontWeight: '100',
  },
  inactive: {
    borderColor: theme.colors.statusBadgeInactiveBorder,
    backgroundColor: theme.colors.statusBadgeInactiveBackground,
    color: theme.colors.encivGray,
  },
  pending: {
    borderColor: theme.colors.secondaryDivider,
    backgroundColor: theme.colors.lightGray,
    color: theme.colors.encivGray,
  },
  response: {
    border: `none !important`,
    color: theme.colors.statusBadgeResponseColor,
  },
  error: {
    borderColor: theme.colors.statusBadgeErrorBorder,
    backgroundColor: theme.colors.statusBadgeErrorBackground,
    color: theme.colors.statusBadgeErrorTextColor,
    fontWeight: '100',
  },
}))

export default StatusBadge
