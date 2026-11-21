// https://github.com/EnCiv/civil-pursuit/issues/68

'use strict'
import React from 'react'
import Point from './point'
import PointInput from './point-input'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

function WhyInput(props) {
  const { point = { subject: '', description: '', _id: '' }, value, onDone = () => {}, className, maxWordCount, maxCharCount, ...otherProps } = props
  const classes = useStyles()

  const handleOnDone = ({ valid, value }) => {
    value && (value.parentId = point._id)
    onDone({ valid, value })
  }
  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <Point className={classes.point} point={point} vState="secondary" />
      <PointInput className={classes.pointInput} maxWordCount={maxWordCount} maxCharCount={maxCharCount} onDone={handleOnDone} value={value} />
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
    boxSizing: 'border-box',
    padding: '1.5rem',
    border: `0.125rem solid ${theme.colors.secondaryDivider}`,
    borderRadius: '0.75rem',
    backgroundColor: theme.colors.white,
    boxShadow: '0 0.125rem 0.375rem rgba(6, 51, 92, 0.06)',
  },
  point: {
    width: '100%',
    minWidth: 0,
    paddingBottom: '0 !important',
    border: 'none !important',
    outline: 'none !important',
    borderRadius: '0 !important',
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
    transform: 'none !important',
    '& > div': {
      padding: '0 !important',
      gap: 0,
    },
    '&:hover': {
      outline: 'none !important',
      boxShadow: 'none !important',
      transform: 'none !important',
    },
  },
  pointInput: {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
  },
  [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
    container: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      alignItems: 'start',
      gap: '1rem',
      padding: '1rem',
    },
  },
}))

export default WhyInput
