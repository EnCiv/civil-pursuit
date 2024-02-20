// https://github.com/EnCiv/civil-pursuit/issue/49
import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function GroupingStep(props) {
  const { onDone, shared, className, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const { pointList, groupedPointList } = shared

  // Initialize groupedPointList if it doesn't exist and manage the ready state
  useEffect(() => {
    if (!groupedPointList) {
      groupedPointList = JSON.parse(JSON.stringify(pointList)) // Deep clone pointList to groupedPointList
    }
    onDone({ valid: true, value: groupedPointList }) // Call onDone with true initially
  }, [shared, onDone])

  return (
    <div className={cx(classes.wrapper, className)} {...props}>
      <p>Hello World</p>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {},
}))
