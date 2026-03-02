// https://github.com/EnCiv/civil-pursuit/issues/[ISSUE_NUMBER]

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Point from './point'
import StatusBadge from './status-badge'
import { H, Level } from 'react-accessible-headings'

function PointMatrix(props) {
  const { className, entries = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction()

  const getRatingStatus = rating => {
    switch (rating?.toLowerCase()) {
      case 'most':
        return 'complete'
      case 'least':
        return 'error'
      case 'neutral':
        return 'progress'
      default:
        return 'inactive'
    }
  }

  const formatRatingDisplay = rating => {
    if (!rating) return 'Not rated'
    return rating.charAt(0).toUpperCase() + rating.slice(1)
  }

  if (entries.length === 0) {
    return (
      <div className={cx(classes.emptyState, className)} {...otherProps}>
        No data to display
      </div>
    )
  }

  const colCount = 3
  const gridTemplateColumns = `repeat(${colCount}, 1fr)`

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.contentContainer}>
        <div key={'header'} className={cx(classes.dataRow)}>
          <div className={classes.response}>
            <H>Response</H>
          </div>
          <div className={cx(classes.pre, classes.cellRating)}>Rating Before</div>
          <div className={cx(classes.post, classes.cellRating)}>Rating After</div>
        </div>

        <Level>
          {entries.map((entry, rowIdx) => {
            const isLastRow = rowIdx === entries.length - 1
            const isOddRow = rowIdx % 2 === 1
            return (
              <div key={rowIdx} className={cx(classes.dataRow, isOddRow ? classes.rowAlt : classes.rowEven, isLastRow && classes.lastRow)}>
                <div className={cx(classes.cell, classes.cellFirst, isLastRow && classes.cellFirstLast)}>
                  <Point point={entry.point} vState="secondary" />
                </div>
                <div className={cx(classes.cell, classes.cellRating)}>
                  <StatusBadge status={getRatingStatus(entry.pre)} name={formatRatingDisplay(entry.pre)} className={classes.statusBadgeText} />
                </div>
                <div className={cx(classes.cell, classes.cellRating, isLastRow && classes.cellRatingLast)}>
                  <StatusBadge status={getRatingStatus(entry.post)} name={formatRatingDisplay(entry.post)} className={classes.statusBadgeText} />
                </div>
              </div>
            )
          })}
        </Level>
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    borderRadius: '1.25rem',
    border: `${theme.border.width.thin} solid rgba(235, 235, 235, 0.8)`,
    overflow: 'hidden',
    background: theme.colors.white,
  },
  contentContainer: {
    position: 'relative',
    borderTopLeftRadius: '1.25rem',
    borderTopRightRadius: '1.25rem',
  },
  headerRow: {
    fontSize: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gridColumnGap: '0.2rem',
    borderBottom: `${theme.border.width.thin} solid ${theme.colors.white}`,
  },
  headerCell: {
    padding: '1.25rem 1rem',
    paddingLeft: '1.75rem',
    margin: '0rem',
    backgroundColor: theme.colors.tabSelected,
    color: theme.colors.primaryButtonBlue,
    fontSize: '1.5rem',
    wordWrap: 'break-word',
    overflow: 'hidden',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '1.2rem',
    },
  },
  headerCellFirst: {
    backgroundColor: theme.colors.primaryButtonBlue,
    color: theme.colors.white,
  },
  headerCellRating: {
    display: 'flex',
    justifyContent: 'center',
  },
  response: {
    padding: '0 1.25rem',
    paddingLeft: '1.25rem',
    margin: '0rem',
    display: 'flex',
    alignItems: 'center',
    height: '5.125rem',
    backgroundColor: theme.colors.primaryButtonBlue,
    color: theme.colors.white,
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: '2rem',
    wordWrap: 'break-word',
    overflow: 'hidden',
    borderTopLeftRadius: '1.25rem',
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      color: theme.colors.white,
      margin: 0,
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '1.2rem',
    },
  },
  pre: {
    padding: '0 2.5rem',
    margin: '0rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '5.125rem',
    backgroundColor: theme.colors.lightBlueBackground,
    color: theme.colors.primaryButtonBlue,
    fontSize: '1.14rem',
    fontWeight: 300,
    lineHeight: '1.81rem',
    wordWrap: 'break-word',
    overflow: 'hidden',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '1rem',
    },
  },
  post: {
    padding: '0 2.5rem',
    margin: '0rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '5.125rem',
    backgroundColor: theme.colors.lightBlueBackground,
    color: theme.colors.primaryButtonBlue,
    fontSize: '1.14rem',
    fontWeight: 300,
    lineHeight: '1.81rem',
    wordWrap: 'break-word',
    overflow: 'hidden',
    borderTopRightRadius: '1.25rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '1rem',
    },
  },
  dataRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gridColumnGap: theme.border.width.thin,
    gridRowGap: 0,
  },
  cell: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '6.1875rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '1rem',
      minHeight: '5rem',
    },
  },
  cellFirst: {
    backgroundColor: theme.colors.white,
  },
  cellRating: {
    padding: '0 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: '1.14rem',
    fontWeight: 300,
    lineHeight: '1.81rem',
  },
  rowEven: {
    '& $cellFirst': {
      backgroundColor: theme.colors.lightGrayBackground,
    },
    '& $cellRating': {
      backgroundColor: theme.colors.lightGrayBackground,
    },
  },
  rowAlt: {
    '& $cellFirst': {
      backgroundColor: 'rgba(235, 235, 235, 0.3)',
    },
    '& $cellRating': {
      backgroundColor: 'rgba(235, 235, 235, 0.3)',
    },
  },
  lastRow: {},
  cellFirstLast: {
    borderBottomLeftRadius: '1.25rem',
  },
  cellRatingLast: {
    borderBottomRightRadius: '1.25rem',
  },
  emptyState: {
    ...theme.font,
    fontSize: '1rem',
    color: theme.colors.textSecondary,
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: theme.colors.veryLightGrayBackground,
    borderRadius: '0.5rem',
    border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
  },
}))

export default PointMatrix
