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
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
    container: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  point: {},
  pointInput: {
    padding: '0 1.875rem',
    boxSizing: 'border-box',
  },
  [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
    point: {
      width: '35%',
      flexGrow: 1,
    },
    pointInput: {
      width: '60%',
      flexGrow: 1,
      padding: 0,
    },
  },
}))

export default WhyInput
