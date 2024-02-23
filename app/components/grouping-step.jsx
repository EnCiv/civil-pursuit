// https://github.com/EnCiv/civil-pursuit/issue/49
'use strict'

import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Point from './point'

export default function GroupingStep(props) {
  const { onDone, shared, className, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  const [points, setPoints] = useState(shared.pointList || [])
  const [groupedPoints, setGroupedPoints] = useState(shared.groupedPointList || [])

  // Initialize groupedPointList if it doesn't exist and manage the ready state
  useEffect(() => {
    if (!shared.groupedPointList) {
      setGroupedPoints([...points]) // Deep clone pointList to groupedPointList
    }
    onDone({ valid: true, value: groupedPoints }) // Call onDone with true initially
  }, [points, groupedPoints, shared.groupedPointList, onDone])

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      {points.map((point, index) => (
        <Point key={index} subject={point.subject} description={point.description} vState={point.vState} />
      ))}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    // Add other styles as necessary for layout and responsiveness
  },
  // Additional styles can be added here
}))
