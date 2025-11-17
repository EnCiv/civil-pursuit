// https://github.com/EnCiv/civil-pursuit/issues/241

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function Metadata(props) {
  const { className, title, child, data, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      {child && <div className={cx(classes.child, className)}>{child}</div>}
      <div className={cx(classes.table, className)}>
        <tr>
          <td className={cx(classes.title, className)}>{title}</td>
        </tr>
        {data?.map(field => (
          <tr>
            <td className={cx(classes.label, className)}>{field.label}</td>
            <td className={cx(classes.value, className)}>{field.value}</td>
          </tr>
        ))}
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
    flexDirection: 'column',
    padding: '1.25rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      borderRadius: '0',
    },
  },
  child: { paddingBottom: '1rem' },
  table: { fontSize: '0.8rem', borderCollapse: 'separate', borderSpacing: '2.25rem 1rem', marginLeft: '-2.25rem' },
  title: { fontWeight: 'bold', paddingBottom: '0.375rem' },
  label: { fontWeight: 'bold', color: theme.colors.encivGray },
  value: { fontWeight: 'bold' },
}))
